package com.example.cpen321_wedo;

import androidx.fragment.app.FragmentActivity;

import android.os.Bundle;

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
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.Polyline;
import com.google.android.gms.maps.model.PolylineOptions;
import com.google.maps.android.PolyUtil;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

public class MapsPlotRouteActivity extends FragmentActivity implements OnMapReadyCallback {

    private GoogleMap mMap;
    private static final String TAG = MapsPlotRouteActivity.class.getName();
    private JSONArray routesArray;

    // Travel mode definition
    final static int DRIVING = 1;
    final static int WALKING = 2;
    final static int BIKING = 3;
    final static int TRANSIT = 4;

    // Parameters for calling API
    private int travelMode;
    private int distanceThreshold;
    JSONArray coordinates;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_maps_plot_route);
        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);

        double[] latitudes = getIntent().getDoubleArrayExtra("latitudes");
        double[] longitudes = getIntent().getDoubleArrayExtra("longitudes");
        travelMode = getIntent().getIntExtra("mode", DRIVING);
        distanceThreshold = getIntent().getIntExtra("distanceThreshold", 0);

        // Convert string coordinates to LatLng
        coordinates = new JSONArray();
        for (int i = 0; i < latitudes.length; i++) {
            coordinates.put(String.valueOf(latitudes[i]) + "," + String.valueOf(longitudes[i]));
        }
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

        LatLng vancouver = new LatLng(49.2576512,-123.2636425);
        mMap.moveCamera(CameraUpdateFactory.newLatLng(vancouver));
        mMap.animateCamera(CameraUpdateFactory.zoomTo(10.0f));

        loadRoutesArray(new VolleyCallBack() {
            @Override
            public void onSuccess() {
                // Plot routes
                Polyline[] polylines = new Polyline[routesArray.length()];

                try {
                    for (int i = 0; i < routesArray.length(); i++) {
                        JSONObject route = (JSONObject) routesArray.get(i);
                        JSONObject overview_polyline = (JSONObject) route.get("overview_polyline");

                        List<LatLng> latLngArraylist = PolyUtil.decode(overview_polyline.getString("points"));
                        LatLng[] plotCoors = new LatLng[latLngArraylist.size()];
                        latLngArraylist.toArray(plotCoors);

                        polylines[i] = mMap.addPolyline(new PolylineOptions().add(plotCoors));
                    }
                }
                catch (Exception e) {
                    System.out.println(e);
                }
            }
        });

    }

    public void loadRoutesArray(final VolleyCallBack callback) {
        JSONObject body = new JSONObject();
        String url;

        // Set up URL
        try {
            body.put("locations", coordinates);
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
                int i = 0;

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
                System.out.println(error);
            }
        });
        queue.add(request);
    }
}