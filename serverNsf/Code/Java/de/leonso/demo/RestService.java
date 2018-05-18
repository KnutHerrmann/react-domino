package de.leonso.demo;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import de.leonso.demo.Parameters;
import de.leonso.demo.Performances;
import de.leonso.demo.Shows;
import de.leonso.demo.Stages;

import org.json.JSONArray;
import org.json.JSONObject;

import com.ibm.domino.services.ServiceException;
import com.ibm.domino.services.rest.RestServiceEngine;
import com.ibm.xsp.extlib.component.rest.CustomService;
import com.ibm.xsp.extlib.component.rest.CustomServiceBean;

/*
 * REST-services for Theater application
 * 
 *  GET .../shows
 *  GET .../shows/id
 *  GET .../performances
 *  GET .../performances/id
 *  GET .../stages
 *  GET .../stages/id
 *  
 *  POST .../performances/id   
 *       payload: [...selectedSeats...]
 *       return: {...availableSeats...}
 *       
 *  Header's Accept-Language: 'de' first (=German) or something else (=English)
 *  
 */

public class RestService extends CustomServiceBean {

	@Override
	public void renderService(CustomService service, RestServiceEngine engine) throws ServiceException {
		try {
			HttpServletRequest request = engine.getHttpRequest();
			HttpServletResponse response = engine.getHttpResponse();
			response.setHeader("Content-Type", "application/json; charset=UTF-8");
			response.setContentType("application/json");
			response.setHeader("Cache-Control", "no-cache");
			response.setCharacterEncoding("utf-8");

			response.addHeader("Access-Control-Allow-Origin", "*");
			response.addHeader("Access-Control-Allow-Credentials", "true");
			response.addHeader("Access-Control-Allow-Methods", "GET, POST");
			response.addHeader("Access-Control-Allow-Headers", "Content-Type");
			response.addHeader("Access-Control-Max-Age", "86400");

			String method = request.getMethod();
			System.out.println(method);
			if (method.equals("GET")) {
				doGet(request, response);
			} else if (method.equals("POST")) {
				doPost(request, response);
			} else {
				throw new RuntimeException("Only GET and POST are allowed.");
			}
			response.setStatus(200);
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}

	private void doGet(HttpServletRequest request, HttpServletResponse response) throws Exception {
		Parameters params = getParameters(request);
		if ("shows".equals(params.getResource())) {
			writeResponseData(response, Shows.get(params));
		} else if ("performances".equals(params.getResource())) {
			writeResponseData(response, Performances.get(params));
		} else if ("stages".equals(params.getResource())) {
			writeResponseData(response, Stages.get(params));
		} else {
			throw new RuntimeException("wrong parameter for GET");
		}
	}

	private void doPost(HttpServletRequest request, HttpServletResponse response) throws Exception {
		Parameters params = getParameters(request);
		if ("performances".equals(params.getResource())) {
			writeResponseData(response, Performances.post(params, getPayload(request)));
		} else {
			throw new RuntimeException("wrong parameter for POST");
		}
	}

	private void writeResponseData(HttpServletResponse response, Object data) throws Exception {
		String jsonData = "";
		if (data instanceof String) {
			jsonData = (String) data;
		} else if (data instanceof JSONObject) {
			jsonData = ((JSONObject) data).toString();
		} else if (data instanceof JSONArray) {
			jsonData = ((JSONArray) data).toString();
		}
		ServletOutputStream outStream = response.getOutputStream();
		ByteArrayInputStream dataStream = new ByteArrayInputStream(jsonData.getBytes("UTF-8"));
		byte[] buffer = new byte[4096];
		int readBytes = 0;
		while (dataStream != null && (readBytes = dataStream.read(buffer)) != -1) {
			outStream.write(buffer, 0, readBytes);
		}
		dataStream.close();
	}

	@SuppressWarnings("unchecked")
	private Parameters getParameters(HttpServletRequest request) {
		Parameters params = new Parameters();
		String[] pathInfo = request.getPathInfo().split("/");
		if (pathInfo.length > 2) {
			params.setResource(pathInfo[2]);
		}
		if (pathInfo.length > 3) {
			params.setId(pathInfo[3]);
		}
		if (pathInfo.length > 4) {
			for (int i = 4; i < pathInfo.length; i++) {
				String[] param = pathInfo[i].split("=");
				params.put(param[0], param[param.length - 1]);
			}
		}
		// all other ?...&... parameters
		params.putAll(request.getParameterMap());

		// "de" for German or empty for English and others
		String acceptLanguage = request.getHeader("accept-language");
		String language = "";
		if (acceptLanguage != null) {
			language = acceptLanguage.substring(0, 2);
			if (!"de".equals(language)) {
				language = "";
			}
		}
		params.setLanguage(language);
		return params;
	}

	private String getPayload(HttpServletRequest request) throws Exception {
		StringBuilder payload = new StringBuilder();
		BufferedReader reader = request.getReader();
		String line;
		while ((line = reader.readLine()) != null) {
			payload.append(line);
		}
		return payload.toString();
	}

}
