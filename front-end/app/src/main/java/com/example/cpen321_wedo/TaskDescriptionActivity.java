package com.example.cpen321_wedo;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.example.cpen321_wedo.singleton.RequestQueueSingleton;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Calendar;
import java.util.Date;

public class TaskDescriptionActivity extends AppCompatActivity {

    private int position;
    private String taskId;
    private String title;
    private String type;
    private String description;
    private String location;
    private String taskListId;

    private TextView taskType;
    private TextView taskDescription;
    private TextView taskLocation;
    private TextView taskLocationLabel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_task_description);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        Intent intent = getIntent();
        position = intent.getIntExtra("index", 0);
        taskListId = intent.getStringExtra("taskListId");

        taskType = findViewById(R.id.taskTypeText);
        taskDescription = findViewById(R.id.taskDescriptionText);
        taskLocation = findViewById(R.id.taskLocationText);
        taskLocationLabel = findViewById(R.id.taskLocationInfo);

        title = intent.getStringExtra("title");
        type = intent.getStringExtra("taskType");
        description = intent.getStringExtra("taskDescription");
        location = intent.getStringExtra("taskLocation");
        taskId = intent.getStringExtra("taskId");

        getSupportActionBar().setTitle(title);
        taskType.setText(type);
        taskDescription.setText(description);

        if (location != null && !location.equals("")) {
            taskLocation.setText(location);
            taskLocationLabel.setVisibility(View.VISIBLE);
            taskLocation.setVisibility(View.VISIBLE);
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.task_activity_description_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        switch (item.getItemId()){
            case R.id.edit:
                Intent intent = new Intent(this, UpdateTaskActivity.class);
                intent.putExtra("taskTitle", title);
                intent.putExtra("taskType", type);
                intent.putExtra("taskDescription", description);
                intent.putExtra("taskLocation", location);
                startActivityForResult(intent, 1);
                return true;
            default:
                break;
        }
        return false;
    }

    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == 1 && resultCode == RESULT_OK) {

            String[] reply = data.getStringArrayExtra("task");
            Log.d("StringArray", reply[0] + reply[1] + reply[2] + reply[3]);

            Date date = new Date();
            long dateModified = date.getTime();

            updateData(reply, taskId,  dateModified);
        }
    }

    private void updateData(final String[] reply, String taskId, final long dateModified) {
        JSONObject object = new JSONObject();
        FirebaseUser firebaseUser = FirebaseAuth.getInstance().getCurrentUser();

        try {
            Date date = new Date(dateModified);
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            int year = calendar.get(Calendar.YEAR);
            int month = calendar.get(Calendar.MONDAY) + 1;
            int day = calendar.get(Calendar.DAY_OF_MONTH);
            String dayToString;
            if (day < 10) {
                dayToString = "0" + day;
            } else {
                dayToString = "" + day;
            }

            String dateModifiedString = "" + year + "-" + month + "-" + dayToString;
            object.put("taskID", taskId);
            object.put("taskDescription", reply[2]);
            object.put("taskType", reply[3]);
            object.put("taskListID", taskListId);
            object.put("userID", firebaseUser.getUid());
            object.put("taskName", reply[0]);
            object.put("address", reply[1]);
            object.put("modifiedTime", dateModifiedString);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        try {
            String url = "http://40.78.89.252:3000/task/update";

            JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.PUT, url, object,
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
                            getSupportActionBar().setTitle(reply[0]);
                            taskDescription.setText(reply[2]);
                            taskType.setText(reply[3]);

                            String location = reply[1];

                            if (!location.equals("") && location != null) {
                                taskLocation.setText(location);
                                taskLocationLabel.setVisibility(View.VISIBLE);
                                taskLocation.setVisibility(View.VISIBLE);
                            }

                            Intent intent = new Intent();
                            intent.putExtra("taskUpdate", reply);
                            intent.putExtra("index", position);
                            intent.putExtra("dateModified", dateModified);
                            setResult(RESULT_OK, intent);
                        }
                    }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Toast.makeText(getApplicationContext(), "Could not update task: "+ error, Toast.LENGTH_SHORT).show();
                    setResult(RESULT_CANCELED);
                }
            });

            RequestQueueSingleton.getInstance(getApplicationContext()).addToRequestQueue(jsonObjectRequest);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}