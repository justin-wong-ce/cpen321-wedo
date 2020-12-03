package com.example.cpen321_wedo;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.ListView;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.example.cpen321_wedo.adapter.GenerateTaskAdapter;
import com.example.cpen321_wedo.models.Task;
import com.example.cpen321_wedo.models.TaskList;
import com.example.cpen321_wedo.singleton.RequestQueueSingleton;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import static com.example.cpen321_wedo.MapsPlotRouteActivity.DRIVING;

public class GenerateRouteActivity extends AppCompatActivity implements GetSelected {

    private GenerateTaskAdapter myAdapter;
    private List<TaskList> lstTaskList = new ArrayList<>();
    private FirebaseUser firebaseUser = FirebaseAuth.getInstance().getCurrentUser();
    private List<Task> tasks = new ArrayList<>();
    private List<Double> latitudes = new ArrayList<>();
    private List<Double> longitudes = new ArrayList<>();
    private JSONArray addresses = new JSONArray();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_generate_route);


        getData();

        myAdapter = new GenerateTaskAdapter(tasks, getLayoutInflater(), this);

        ListView myrv = findViewById(R.id.ListViewCatalog);
        myrv.setAdapter(myAdapter);

        Button btn_generateRoute = findViewById(R.id.btn_generateRoute);
        btn_generateRoute.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                //TODO: add more stuff here! To call backend to generate route!
                getPoint();
            }
        });
    }

    public void getPoint(){

        String url = "http://40.78.89.252:3000/routes/driving";

        JSONObject object = new JSONObject();
        try {
            JSONArray array = new JSONArray();
            array.put("Marine Gateway, 458 SW Marine Dr, Vancouver, BC V5X 0C4");
            array.put("1319 W 47th AveVancouver, BC V6M 2L7");
            array.put("6335 Thunderbird Crescent, Vancouver, BC V6T 2G9");
            array.put("W Georgia St Unit G031, Vancouver, BC V7Y 1G5");
            array.put("650 W 41st Ave, Vancouver, BC V5Z 2M9");


            //input your API parameters
            object.put("locations",addresses);
            object.put("distanceThreshold",100);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        try {
            JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, url, object, new Response.Listener<JSONObject>() {
                @Override
                public void onResponse(JSONObject response) {
                    try {
//                        JSONObject routes = new JSONObject(new Gson().toJson(response.getJSONArray("routers").get(0)));
                        JSONObject routes = (JSONObject)response.getJSONArray("routes").get(0);
                        JSONArray legs = routes.getJSONArray("legs");

                        for(int i =0; i<legs.length(); i++){
                            JSONObject legsChild = (JSONObject)legs.get(i);

                            JSONArray step = legsChild.getJSONArray("steps");
//                            Log.d("test",i+"");
                            for(int j = 0;j<step.length();j++){
//                                Log.d("test",j+"");
                                JSONObject oneStep = (JSONObject)step.get(j);
                                JSONObject end = (JSONObject)oneStep.get("end_location");
//                                latitudes.add((Double)start.get("lat"));
                                latitudes.add((Double)end.get("lat"));
//                                longitudes.add((Double)start.get("lng"));
                                longitudes.add((Double)end.get("lng"));
                            }

                        }

                    } catch (JSONException e) {
                        Log.d("test", "you shouldn't be here");
                        e.printStackTrace();
                    }

                    if(latitudes.size()>25){
                        createAndShowDialog();
                    }else{
                        intentCallFunction();
                    }

                }

            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.d("test", "erro for getting route from backend");
//                    Toast.makeText(getApplicationContext(), "Error"+error, Toast.LENGTH_LONG).show();
                }
            });

            RequestQueueSingleton.getInstance(this).addToRequestQueue(jsonObjectRequest);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void intentCallFunction(){
        Intent mapsIntent = new Intent(GenerateRouteActivity.this, MapsPlotRouteActivity.class);
//                    double[] latitudes_array = new double[latitudes.size()>25?25:latitudes.size()];
//                    double[] longitudes_array = new double[longitudes.size()>25?25:longitudes.size()];
        double[] latitudes_array = new double[latitudes.size()];
        double[] longitudes_array = new double[longitudes.size()];

        for(int i =0; i<latitudes.size(); i++){
            latitudes_array[i] = latitudes.get(i).doubleValue();
            longitudes_array[i] = longitudes.get(i).doubleValue();
        }

        mapsIntent.putExtra("latitudes", latitudes_array);
        mapsIntent.putExtra("longitudes", longitudes_array);
        mapsIntent.putExtra("mode", DRIVING);

        int distanceThreshold = 100;
        mapsIntent.putExtra("distanceThreshold", distanceThreshold);

        startActivity(mapsIntent);
    }


    public void getData(){
        try {
            String url = "http://40.78.89.252:3000/user/tasklists/";
            url+="\"";
            url+=firebaseUser.getUid();
            Log.d("test", url);
            url+="\"";

            JsonArrayRequest jsonArrayRequest = new JsonArrayRequest(Request.Method.GET, url, null, new Response.Listener<JSONArray>() {
                @Override
                public void onResponse(JSONArray response) {
                    lstTaskList.clear();

                    for(int i=0;i<response.length();i++){
                        try {

                            //TODO: after Justin make change to the backend please don't forget to change here!

                            TaskList taskList = new TaskList(response.getJSONObject(i).get("taskListName").toString(),"We should add description attribute to tasklist later on", response.getJSONObject(i).get("taskListID").toString());
                            lstTaskList.add(taskList);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }

                    //get task data from backend again:
                    String url = "http://40.78.89.252:3000/tasklist/get/";
                    url+="\"";
                    url+=firebaseUser.getUid();
                    url+="\"/";

                    for(int i =0; i<lstTaskList.size();i++){
                        String passurl = url;

                        passurl+="\"";
                        passurl+=lstTaskList.get(i).getTaskListID();
                        passurl+="\"";
                        Log.d("test", passurl);
                        getTask(passurl);
                    }


                }

            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.d("test", error.toString());
//                    Toast.makeText(getApplicationContext(), "Error"+error, Toast.LENGTH_LONG).show();
                }
            });

            RequestQueueSingleton.getInstance(this).addToRequestQueue(jsonArrayRequest);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void getTask(String url){
        try {
            JsonArrayRequest jsonArrayRequest = new JsonArrayRequest(Request.Method.GET, url, null, new Response.Listener<JSONArray>() {
                @Override
                public void onResponse(JSONArray response) {
                    lstTaskList.clear();

                    for(int i=0;i<response.length();i++){
                        try {
                            if(!response.getJSONObject(i).get("address").toString().equals("")){
                                Task task = new Task(response.getJSONObject(i).get("taskName").toString(), response.getJSONObject(i).get("address").toString());
                                tasks.add(task);
                            }

                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }

                    myAdapter.notifyDataSetChanged();
                }

            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.d("test", error.toString());
//                    Toast.makeText(getApplicationContext(), "Error"+error, Toast.LENGTH_LONG).show();
                }
            });

            RequestQueueSingleton.getInstance(this).addToRequestQueue(jsonArrayRequest);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void createAndShowDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);

        LayoutInflater inflater = this.getLayoutInflater();
        View view = inflater.inflate(R.layout.layout_dialog, null);
        builder.setView(view)
                .setTitle("Warning")
                .setNegativeButton("cancel", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
//                        setTargetFragment(fragment, 0);
                    }
                })
                .setPositiveButton("ok", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
//                        setTargetFragment(fragment, 1);
                        intentCallFunction();
                    }
                });
        builder.create().show();
    }

    @Override
    public void onAdd(String address) {
        addresses.put(address);
    }

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    @Override
    public void onDelete(String address) throws JSONException {
        for(int i =0; i<addresses.length(); i++){
            if(addresses.get(i) == address){
                addresses.remove(i);
                break;
            }
        }
    }
}