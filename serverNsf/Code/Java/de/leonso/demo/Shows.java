package de.leonso.demo;

import lotus.domino.Database;
import lotus.domino.Document;
import lotus.domino.View;
import lotus.domino.ViewEntry;
import lotus.domino.ViewEntryCollection;

import org.json.JSONArray;
import org.json.JSONObject;

import com.ibm.xsp.extlib.util.ExtLibUtil;
public class Shows {
	private static final String ITEM_ID = "Id";
	private static final String ITEM_TITLE = "Title";
	private static final String ITEM_SUBTITLE = "Subtitle";
	private static final String ITEM_DESCRIPTION = "Description";

	public static Object get(Parameters params) throws Exception {
		Database db = ExtLibUtil.getCurrentDatabase();
		if (params.getId().isEmpty()) {
			View view = db.getView("all");
			JSONArray array = new JSONArray();
			ViewEntryCollection entries = view.getAllEntriesByKey("show", true);
			ViewEntry entry = entries.getFirstEntry();
			while (entry != null) {
				entry.setPreferJavaDates(true);
				ViewEntry nextEntry = entries.getNextEntry(entry);
				array.put(getShowObject(entry.getDocument(), params.getLanguage()));
				entry.recycle();
				entry = nextEntry;
		}
			return array;
		}
		View view = db.getView("shows");
		Document doc = view.getDocumentByKey(params.getId(), true);
		return getShowObject(doc, params.getLanguage());
	}

	private static Object getShowObject(Document doc, String language) throws Exception {
		JSONObject object = new JSONObject();
		if (doc != null) {
			object.put("id", doc.getItemValueString(ITEM_ID));
			object.put("title", doc.getItemValueString(ITEM_TITLE + language));
			object.put("subtitle", doc.getItemValueString(ITEM_SUBTITLE + language));
			object.put("description", doc.getItemValueString(ITEM_DESCRIPTION + language));
			doc.recycle();
		}
		return object;
	}

}
