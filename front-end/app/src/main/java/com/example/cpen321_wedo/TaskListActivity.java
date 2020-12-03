package com.example.cpen321_wedo;


import android.annotation.SuppressLint;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.ItemTouchHelper;
import androidx.recyclerview.widget.RecyclerView;
import androidx.recyclerview.widget.StaggeredGridLayoutManager;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.example.cpen321_wedo.adapter.TaskListAdapter;
import com.example.cpen321_wedo.models.TaskList;
import com.example.cpen321_wedo.singleton.RequestQueueSingleton;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.iid.FirebaseInstanceId;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

public class TaskListActivity extends AppCompatActivity implements UpdateTasklistInterface {
    private List<TaskList> lstTaskList;

    private FirebaseUser firebaseUser;

    private TaskListAdapter myAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_task_list);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle("TaskList");

        FloatingActionButton fab = findViewById(R.id.fab_tasklist);
        firebaseUser = FirebaseAuth.getInstance().getCurrentUser();

        //TODO: this is low efficient
        updateToken();

        lstTaskList = new ArrayList<>();

        RecyclerView myrv = findViewById(R.id.recyclerview_id);
        myAdapter = new TaskListAdapter(this, lstTaskList, this);
        myrv.setLayoutManager((new StaggeredGridLayoutManager(1, 1)));

        myrv.setAdapter(myAdapter);

        getData();

        // drag and drop
        ItemTouchHelper itemTouchHelper = new ItemTouchHelper(new ItemTouchHelper.SimpleCallback(ItemTouchHelper.UP | ItemTouchHelper.DOWN, 0) {
            @Override
            public boolean onMove(@NonNull RecyclerView recyclerView, @NonNull RecyclerView.ViewHolder dragged, @NonNull RecyclerView.ViewHolder target) {

                int position_dragged = dragged.getAbsoluteAdapterPosition();
                int position_target = target.getAbsoluteAdapterPosition();

                Collections.swap(lstTaskList, position_dragged, position_target);
                myAdapter.notifyItemMoved(position_dragged, position_target);

                return false;
            }

            @Override
            public void onSwiped(@NonNull RecyclerView.ViewHolder viewHolder, int direction) {
                Log.d("test", "You can swiping " + direction + ", we will implement this later");
            }
        });

        itemTouchHelper.attachToRecyclerView(myrv);


        // fab button clicked:
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(TaskListActivity.this, AddTaskListActivity.class);
                intent.putExtra("add" ,true);
                startActivityForResult(intent, 2);
            }
        });

        createNotificationChannel();
    }

    private void updateToken(){
        DatabaseReference reference = FirebaseDatabase.getInstance().getReference("Tokens");
        HashMap<String, String> hashMap = new HashMap<>();
        hashMap.put("token", FirebaseInstanceId.getInstance().getToken());
        reference.child(firebaseUser.getUid()).setValue(hashMap);
    }

    private void createNotificationChannel() {
        // Create the NotificationChannel, but only on API 26+ because
        // the NotificationChannel class is new and not in the support library
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = "test";
            String description = "test notification";
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel("1", name, importance);
            channel.setDescription(description);
            // Register the channel with the system; you can't change the importance
            // or other notification behaviors after this
            NotificationManager notificationManager = this.getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.memu, menu);
        return true;
    }



    @SuppressLint("NonConstantResourceId")
    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        boolean logout = false;
        switch (item.getItemId()){
            case R.id.logout:
                logout = true;
                break;
//            case R.id.map_test:
//
//                Intent mapsIntent = new Intent(TaskListActivity.this, MapsPlotRouteActivity.class);
//                double[] latitudes = {49.261599, 49.234620, 49.234562};
//                double[] longitudes = {-123.249374, -123.184539, -123.116674};
//                mapsIntent.putExtra("latitudes", latitudes);
//                mapsIntent.putExtra("longitudes", longitudes);
//                mapsIntent.putExtra("mode", DRIVING);
//
//                int distanceThreshold = 100;
//                mapsIntent.putExtra("distanceThreshold", distanceThreshold);
//
//                startActivity(mapsIntent);
//                return true;
            case R.id.generate_route:
                Intent newIntent = new Intent(TaskListActivity.this, GenerateRouteActivity.class);

                startActivity(newIntent);
                break;
            case R.id.ic_chat:
                startActivity(new Intent(TaskListActivity.this, FriendListActivity.class));
                break;
            case R.id.tasklist_invitation:
                startActivityForResult(new Intent(TaskListActivity.this, AcceptTaskListActivity.class), 3);
                break;
            default:
                break;
        }
        if(logout){
            FirebaseAuth.getInstance().signOut();
            startActivity(new Intent(TaskListActivity.this, StartActivity.class));
            finish();
        }
        return true;
    }


    // Get Request For JSONObject
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

                            TaskList taskList = new TaskList(response.getJSONObject(i).get("taskListName").toString(),response.getJSONObject(i).get("taskListDescription").toString(), response.getJSONObject(i).get("taskListID").toString());
                            lstTaskList.add(taskList);
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
                }
            });

            RequestQueueSingleton.getInstance(this).addToRequestQueue(jsonArrayRequest);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Call Back method  to get the Message form other Activity
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data)
    {
        if(data==null){
            return;
        }
        super.onActivityResult(requestCode, resultCode, data);
        // check if the request code is same as what is passed  here it is 2
        if(requestCode==2 && data.hasExtra("json"))
        {
            try {
                JSONObject mJsonObject = new JSONObject(data.getStringExtra("json"));

                TaskList taskList = new TaskList(mJsonObject.getString("taskListName"), mJsonObject.getString("taskListDescription"), mJsonObject.getString("taskListID"));
                lstTaskList.add(taskList);
                myAdapter.notifyDataSetChanged();
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }else if(requestCode == 3){
            getData();
        }
    }

    @Override
    public void helper(String id) {
        Intent intent = new Intent(TaskListActivity.this, AddTaskListActivity.class);
        intent.putExtra("add" ,false);
        intent.putExtra("taskListID", id);
        startActivityForResult(intent, 3);
    }

}
