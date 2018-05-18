package de.leonso.demo;

import java.text.SimpleDateFormat;
import java.util.Date;

import lotus.domino.Database;
import lotus.domino.Document;
import lotus.domino.Item;
import lotus.domino.RichTextItem;
import lotus.domino.View;
import lotus.domino.ViewEntry;
import lotus.domino.ViewEntryCollection;

import org.json.JSONArray;
import org.json.JSONObject;

import com.ibm.xsp.extlib.util.ExtLibUtil;

public class Performances {
	private static final String ITEM_ID = "Id";
	private static final String ITEM_SHOW_ID = "ShowId";
	private static final String ITEM_STAGE_ID = "StageId";
	private static final String ITEM_DATE = "Date";
	private static final String ITEM_TIME = "Time";
	private static final String ITEM_PRICE1 = "Price1";
	private static final String ITEM_PRICE2 = "Price2";
	private static final String ITEM_PRICE3 = "Price3";
	private static final String ITEM_AVAILABLE_SEATS = "AvailableSeats";

	public static Object get(Parameters params) throws Exception {
		Database db = ExtLibUtil.getCurrentDatabase();
		if (params.getId().isEmpty()) {
			View view = db.getView("all");
			JSONArray array = new JSONArray();
			ViewEntryCollection entries = view.getAllEntriesByKey("performance", true);
				ViewEntry entry = entries.getFirstEntry();
				while (entry != null) {
					entry.setPreferJavaDates(true);
					ViewEntry nextEntry = entries.getNextEntry(entry);
					array.put(getPerformanceObject(entry.getDocument()));
					entry.recycle();
					entry = nextEntry;
			}
			return array;
		}
		View view = db.getView("performances");
		Document doc = view.getDocumentByKey(params.getId(), true);
		return getPerformanceObject(doc);
	}

	private static Object getPerformanceObject(Document doc) throws Exception {
		JSONObject object = new JSONObject();
		if (doc != null) {
			object.put("id", doc.getItemValueString(ITEM_ID));
			object.put("showId", doc.getItemValueString(ITEM_SHOW_ID));
			object.put("stageId", doc.getItemValueString(ITEM_STAGE_ID));
			Item item = doc.getFirstItem(ITEM_DATE);
			Date date = item.getDateTimeValue().toJavaDate();
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
			object.put("date", dateFormat.format(date));
			item = doc.getFirstItem(ITEM_TIME);
			date = item.getDateTimeValue().toJavaDate();
			dateFormat = new SimpleDateFormat("HH:mm");
			object.put("time", dateFormat.format(date));
			JSONObject prices = new JSONObject();
			prices.put("1", doc.getItemValueDouble(ITEM_PRICE1));
			prices.put("2", doc.getItemValueDouble(ITEM_PRICE2));
			prices.put("3", doc.getItemValueDouble(ITEM_PRICE3));
			object.put("prices", prices);
			RichTextItem rtitem = (RichTextItem) doc.getFirstItem(ITEM_AVAILABLE_SEATS);
			JSONObject seats = new JSONObject(rtitem.getUnformattedText());
			object.put("availableSeats", seats);
			doc.recycle();
		}
		return object;
	}

	public static Object post(Parameters params, String payload) throws Exception {
		if (params.getId().isEmpty()) {
			return new JSONObject();
		}
		JSONArray selectedSeats = new JSONArray(payload);
		Database db = ExtLibUtil.getCurrentDatabase();
		View view = db.getView("performances");
		Document doc = view.getDocumentByKey(params.getId(), true);
		RichTextItem rtitem = (RichTextItem) doc.getFirstItem(ITEM_AVAILABLE_SEATS);
		JSONObject availableSeats = new JSONObject(rtitem.getUnformattedText());
		for (int i = 0; i < selectedSeats.length(); i++) {
			String selectedSeat = (String) selectedSeats.get(i);
			availableSeats.remove(selectedSeat);
		}
		doc.removeItem(ITEM_AVAILABLE_SEATS);
		rtitem = doc.createRichTextItem(ITEM_AVAILABLE_SEATS);
		rtitem.appendText(availableSeats.toString(2));
		doc.save();
		doc.recycle();
		return availableSeats;
	}

}
