package com.example.cpen321_wedo;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.example.cpen321_wedo.Models.TaskList;
import com.example.cpen321_wedo.Singleton.RequestQueueSingleton;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.rengwuxian.materialedittext.MaterialEditText;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Date;

public class AddTaskListActivity extends AppCompatActivity {

    MaterialEditText tasklistName;
    Button btn_created;

    FirebaseUser firebaseUser;
    Date date = new Date();


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_task_list);

        tasklistName = findViewById(R.id.tasklist_name);
        btn_created = findViewById(R.id.btn_add_tasklist);
        firebaseUser = FirebaseAuth.getInstance().getCurrentUser();

        btn_created.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String txt_tasklistName = tasklistName.getText().toString();
                if(!TextUtils.isEmpty(txt_tasklistName)){
                    postData(txt_tasklistName);
                }
            }
        });
    }

    // Get Request For JSONObject
    public void postData(String txt_tasklistName){
        RequestQueue queue = RequestQueueSingleton.getInstance(this.getApplicationContext()).
                getRequestQueue();
        JSONObject object = new JSONObject();
        try {
            //input your API parameters
            object.put("chatID",1);
            object.put("userID","1");
            object.put("taskListName",txt_tasklistName);
            object.put("taskListID",firebaseUser.getUid()+date.getTime());
            object.put("userCap","5");
        } catch (JSONException e) {
            e.printStackTrace();
        }

        Log.d("test", "hhhhhhh");
        try {
            String url = "http://40.78.89.252:3000/taskList";

            JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, url, object,
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
                            // TODO: to ask the TasklistActivity to update.
                            finish();
                        }
                    }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Toast.makeText(getApplicationContext(), "Error"+error, Toast.LENGTH_LONG).show();
                }
            });

            RequestQueueSingleton.getInstance(this).addToRequestQueue(jsonObjectRequest);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}