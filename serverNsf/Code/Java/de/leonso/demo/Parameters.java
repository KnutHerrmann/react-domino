package de.leonso.demo;

import java.util.HashMap;

public class Parameters extends HashMap<String, String> {
	private static final long serialVersionUID = 1L;
	private String resource = "";
	private String id = "";
	private String language = "";

	public void setId(String id) {
		this.id = id;
	}

	public String getId() {
		return id;
	}

	public void setLanguage(String language) {
		this.language = language;
	}

	public String getLanguage() {
		return language;
	}

	public void setResource(String resource) {
		this.resource = resource;
	}

	public String getResource() {
		return resource;
	}

}
