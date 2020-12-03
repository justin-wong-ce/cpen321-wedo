package com.example.cpen321_wedo;

import androidx.fragment.app.FragmentActivity;

import android.os.Bundle;
import android.util.Log;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.example.cpen321_wedo.map.VolleyCallBack;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Polyline;
import com.google.android.gms.maps.model.PolylineOptions;
import com.google.maps.android.PolyUtil;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class MapsPlotRouteActivity extends FragmentActivity implements OnMapReadyCallback {

    private GoogleMap mMap;
//    private static final String TAG = MapsPlotRouteActivity.class.getName();
    private JSONArray routesArray;

    // Travel mode definition
    public final static int DRIVING = 1;
    public final static int WALKING = 2;
    public final static int BIKING = 3;
    public final static int TRANSIT = 4;

    // Parameters for calling API
    private int travelMode;
    private int distanceThreshold;
//    private JSONArray coordinates;
    private LatLng start;

    private List<JSONArray> coordinatesArray = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_maps_plot_route);
        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);

        double[] latitudes = getIntent().getDoubleArrayExtra("latitudes");
        double[] longitudes = getIntent().getDoubleArrayExtra("longitudes");
        start = new LatLng(latitudes[0],longitudes[0]);
        travelMode = getIntent().getIntExtra("mode", DRIVING);
        distanceThreshold = getIntent().getIntExtra("distanceThreshold", 0);

        // Convert string coordinates to LatLng
        int num = (latitudes.length-1)/25+1;
        for(int i =0;i<num;i++){
            JSONArray add = new JSONArray();
            for(int j =0;(i<num-1 && j<25)||(i==num-1 && i*25+j<latitudes.length); j++){
                add.put(String.valueOf(latitudes[i*25+j]) + "," + String.valueOf(longitudes[i*25+j]));
            }
            coordinatesArray.add(add);
        }
//        coordinates = new JSONArray();
//        for (int i = 0; i < latitudes.length; i++) {
//            coordinates.put(String.valueOf(latitudes[i]) + "," + String.valueOf(longitudes[i]));
//        }
        mapFragment.getMapAsync(this);
    }

    /**
     * Manipulates the map once available.
     * This callback is triggered when the map is ready to be used.
     * This is where we can add markers or lines, add listeners or move the camera. In this case,
     * we just add a marker near Sydney, Australia.
     * If Google Play services is not installed on the device, the user will be prompted to install
     * it inside the SupportMapFragment. This method will only be triggered once the user has
     * installed Google Play services and returned to the app.
     */
    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;


        mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(start, 10));

        for(int i =0;i<coordinatesArray.size();i++){
            Log.d("test", i+"");
            loadRoutesArray(new VolleyCallBack() {
                @Override
                public void onSuccess() {
                    // Plot routes
                    Polyline[] polylines = new Polyline[routesArray.length()];

                    try {
                        for (int j = 0; j < routesArray.length(); j++) {
                            JSONObject route = (JSONObject) routesArray.get(j);
                            JSONObject overview_polyline = (JSONObject) route.get("overview_polyline");

                            List<LatLng> latLngArraylist = PolyUtil.decode(overview_polyline.getString("points"));
                            LatLng[] plotCoors = new LatLng[latLngArraylist.size()];
                            latLngArraylist.toArray(plotCoors);

                            polylines[j] = mMap.addPolyline(new PolylineOptions().add(plotCoors));
                        }
                    }
                    catch (Exception e) {
                        System.out.println(e);
                    }
                }
            },i);
        }

//        loadRoutesArray(new VolleyCallBack() {
//            @Override
//            public void onSuccess() {
//                // Plot routes
//                Polyline[] polylines = new Polyline[routesArray.length()];
//
//                try {
//                    for (int i = 0; i < routesArray.length(); i++) {
//                        JSONObject route = (JSONObject) routesArray.get(i);
//                        JSONObject overview_polyline = (JSONObject) route.get("overview_polyline");
//
//                        List<LatLng> latLngArraylist = PolyUtil.decode(overview_polyline.getString("points"));
//                        LatLng[] plotCoors = new LatLng[latLngArraylist.size()];
//                        latLngArraylist.toArray(plotCoors);
//
//                        polylines[i] = mMap.addPolyline(new PolylineOptions().add(plotCoors));
//                    }
//                }
//                catch (Exception e) {
//                    System.out.println(e);
//                }
//            }
//        });

    }

    public void loadRoutesArray(final VolleyCallBack callback, int index) {
        JSONObject body = new JSONObject();
        String url;

        // Set up URL
        try {
            body.put("locations", coordinatesArray.get(index));
        } catch (JSONException e) {
            e.printStackTrace();
        }

        if (travelMode == WALKING) {
            url = "http://40.78.89.252:3000/routes/walking";
        }
        else if (travelMode == BIKING) {
            url = "http://40.78.89.252:3000/routes/biking";
        }
        else if (travelMode == TRANSIT) {
            url = "http://40.78.89.252:3000/routes/transit";
            try {
                body.put("distanceThreshold", distanceThreshold);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        else {
            url = "http://40.78.89.252:3000/routes/driving";
        }

        RequestQueue queue = Volley.newRequestQueue(getApplicationContext());
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.POST, url, body, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                try {
                    routesArray = (JSONArray) response.get("routes");
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                System.out.println("CHECK CHECK CHECK: " + routesArray.toString());
                callback.onSuccess();
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d("test", error.toString());
            }
        });
        queue.add(request);
    }

//    public void loadRoutesArray(final VolleyCallBack callback) {
//        JSONObject body = new JSONObject();
//        String url;
//
//        // Set up URL
//        try {
//            body.put("locations", coordinates);
//        } catch (JSONException e) {
//            e.printStackTrace();
//        }
//
//        if (travelMode == WALKING) {
//            url = "http://40.78.89.252:3000/routes/walking";
//        }
//        else if (travelMode == BIKING) {
//            url = "http://40.78.89.252:3000/routes/biking";
//        }
//        else if (travelMode == TRANSIT) {
//            url = "http://40.78.89.252:3000/routes/transit";
//            try {
//                body.put("distanceThreshold", distanceThreshold);
//            } catch (JSONException e) {
//                e.printStackTrace();
//            }
//        }
//        else {
//            url = "http://40.78.89.252:3000/routes/driving";
//        }
//
//        RequestQueue queue = Volley.newRequestQueue(getApplicationContext());
//        JsonObjectRequest request = new JsonObjectRequest(Request.Method.POST, url, body, new Response.Listener<JSONObject>() {
//            @Override
//            public void onResponse(JSONObject response) {
//                try {
//                    routesArray = (JSONArray) response.get("routes");
//                } catch (JSONException e) {
//                    e.printStackTrace();
//                }
//                System.out.println("CHECK CHECK CHECK: " + routesArray.toString());
//                callback.onSuccess();
//            }
//        }, new Response.ErrorListener() {
//            @Override
//            public void onErrorResponse(VolleyError error) {
//                Log.d("test", error.toString());
//            }
//        });
//        queue.add(request);
//    }
}