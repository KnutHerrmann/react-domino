package de.leonso.demo;

import lotus.domino.Database;
import lotus.domino.Document;
import lotus.domino.RichTextItem;
import lotus.domino.View;
import lotus.domino.ViewEntry;
import lotus.domino.ViewEntryCollection;

import org.json.JSONArray;
import org.json.JSONObject;

import com.ibm.xsp.extlib.util.ExtLibUtil;

public class Stages {
	private static final String ITEM_ID = "Id";
	private static final String ITEM_NAME = "Name";
	private static final String ITEM_WIDTH = "Width";
	private static final String ITEM_HEIGHT = "Height";
	private static final String ITEM_ZOOM_START = "zoomStart";
	private static final String ITEM_ZOOM_MIN = "zoomMin";
	private static final String ITEM_ZOOM_MAX = "zoomMax";
	private static final String ITEM_SEATS = "Seats";
	private static final String ITEM_CATEGORIES = "Categories";
	private static final String ITEM_ROWS = "rows";
	private static final String ITEM_LABELS = "labels";
	private static final String ITEM_HTMLS = "htmls";

	public static Object get(Parameters params) throws Exception {
		Database db = ExtLibUtil.getCurrentDatabase();
		if (params.getId().isEmpty()) {
			View view = db.getView("all");
			JSONArray array = new JSONArray();
			ViewEntryCollection entries = view.getAllEntriesByKey("stage", true);
			ViewEntry entry = entries.getFirstEntry();
			while (entry != null) {
				entry.setPreferJavaDates(true);
				ViewEntry nextEntry = entries.getNextEntry(entry);
				array.put(getStageObject(entry.getDocument(), params.getLanguage()));
				entry.recycle();
				entry = nextEntry;
			}
			return array;
		}
		View view = db.getView("stages");
		Document doc = view.getDocumentByKey(params.getId(), true);
		return getStageObject(doc, params.getLanguage());
	}

	private static Object getStageObject(Document doc, String language) throws Exception {

		JSONObject object = new JSONObject();
		if (doc != null) {
			object.put("id", doc.getItemValueString(ITEM_ID));
			object.put("name", doc.getItemValueString(ITEM_NAME + language));
			object.put("width", doc.getItemValueDouble(ITEM_WIDTH));
			object.put("height", doc.getItemValueDouble(ITEM_HEIGHT));
			object.put("zoomStart", doc.getItemValueDouble(ITEM_ZOOM_START));
			object.put("zoomMin", doc.getItemValueDouble(ITEM_ZOOM_MIN));
			object.put("zoomMax", doc.getItemValueDouble(ITEM_ZOOM_MAX));
			RichTextItem rtitem = (RichTextItem) doc.getFirstItem(ITEM_SEATS);
			object.put("seats", new JSONArray(rtitem.getUnformattedText()));
			rtitem = (RichTextItem) doc.getFirstItem(ITEM_CATEGORIES);
			object.put("categories", new JSONObject(rtitem.getUnformattedText()));
			rtitem = (RichTextItem) doc.getFirstItem(ITEM_ROWS);
			object.put("rows", new JSONArray(rtitem.getUnformattedText()));
			rtitem = (RichTextItem) doc.getFirstItem(ITEM_LABELS);
			object.put("labels", new JSONArray(rtitem.getUnformattedText()));
			rtitem = (RichTextItem) doc.getFirstItem(ITEM_HTMLS);
			object.put("htmls", new JSONArray(rtitem.getUnformattedText()));
			doc.recycle();
		}
		return object;
	}

}
