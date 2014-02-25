package edu.swin.SwinNetSim;

import java.io.IOException;

import org.apache.commons.lang3.time.StopWatch;

import com.amazonaws.util.json.JSONException;
import com.amazonaws.util.json.JSONObject;

public class TestDownload {
		
	public final static String SERVER_URL = "http://ec2-54-196-212-34.compute-1.amazonaws.com/";
	public final static String SMALL_FILE = "texter/small";
	public final static String MEDIUM_FILE = "texter/medium";
	public final static String LARGE_FILE = "texter/large";
	public final static String XLARGE_FILE = "texter/xlarge";
	public final static String XXLARGE_FILE = "texter/xxlarge";
	
	public final static int REPEAT = 50;
	
	public static void main(String [] args) throws IOException, JSONException {		
		System.out.println("=====================================================");
		System.out.println("Running on server url " + SERVER_URL);
		System.out.println("=====================================================");
		
		// SMALL_FILE over REPEAT times
		System.out.println("Downloading small files...");
		testDownload(TestDownload.SMALL_FILE);
		
		System.out.println("=====================================================");
		System.out.println("Downloading medium files...");
		testDownload(TestDownload.MEDIUM_FILE);
		
		System.out.println("=====================================================");
		System.out.println("Downloading large files...");
		testDownload(TestDownload.XLARGE_FILE);
		
		System.out.println("=====================================================");
		System.out.println("Downloading x-large files...");
		testDownload(TestDownload.XXLARGE_FILE);
	}

	private static void testDownload(String testFile) throws IOException,
			JSONException {
		// Get the starting time
		StopWatch watch = new StopWatch();
		watch.start();
		for(int i = 0; i < TestDownload.REPEAT; i++) {
			JSONObject json = JsonReader.readJsonFromUrl(SERVER_URL + testFile);
			System.out.print('.');
		}
		watch.stop();
		long totalTime = watch.getTime();

		System.out.println("done!");
		System.out.println("Time taken: " + totalTime + " ms");
		System.out.println("On average: " + (totalTime / TestDownload.REPEAT) + " ms");
	}

}
