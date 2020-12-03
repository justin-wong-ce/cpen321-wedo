package com.example.cpen321_wedo.fragments;

import android.os.Build;
import android.os.Bundle;

import androidx.annotation.RequiresApi;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.example.cpen321_wedo.adapter.TaskAdapter;
import com.example.cpen321_wedo.models.Task;
import com.example.cpen321_wedo.R;
import com.example.cpen321_wedo.singleton.RequestQueueSingleton;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Objects;

import static androidx.recyclerview.widget.RecyclerView.VERTICAL;

public class TaskFragment extends Fragment {

    private TaskAdapter taskAdapter;
    private FirebaseUser firebaseUser;
    private ArrayList<Task> tasks;
    private final String taskListId;

    public TaskFragment(String taskListId) {
        this.taskListId = taskListId;
        tasks = new ArrayList<>();
    }

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        RecyclerView taskRecyclerView;
        View view = inflater.inflate(R.layout.fragment_task, container, false);

        taskRecyclerView = view.findViewById(R.id.taskRecyclerView);
        taskRecyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        taskRecyclerView.setHasFixedSize(true);

        DividerItemDecoration itemDecor = new DividerItemDecoration(Objects.requireNonNull(getContext()), VERTICAL);
        taskRecyclerView.addItemDecoration(itemDecor);

        firebaseUser = FirebaseAuth.getInstance().getCurrentUser();

        getData();

        taskAdapter = new TaskAdapter(getContext(), getActivity());
        taskAdapter.setTasks(tasks);

        taskRecyclerView.setAdapter(taskAdapter);

        return view;
    }

    public void addTask(Task task) {
        taskAdapter.addTask(task);
    }
    
    public void updateTask(String taskName, String taskType, String taskDescription, String taskLocation, int position) {
        taskAdapter.updateTask(taskName, taskType, taskDescription, taskLocation, position);
    }

    public void toggleItemViewType () { taskAdapter.toggleItemViewType(); }

    public void deleteTasksSelected() {
        ArrayList<Task> toDelete = taskAdapter.getDeleteTasks();

        for (int i = 0; i < toDelete.size(); i++) {
            deleteData(toDelete.get(i).getTaskId());
        }
        taskAdapter.deleteTasksSelected();
    }

    public void setMenu(Menu menu) {
        this.taskAdapter.setMenu(menu);
    }

    public void getData() {
        tasks.clear();
        try {
            String url = "http://40.78.89.252:3000/tasklist/get/\"";
            url+= firebaseUser.getUid();
            url+= "\"/\"";
            url+= this.taskListId + "\"";
            JsonArrayRequest jsonArrayRequest = new JsonArrayRequest(Request.Method.GET, url, null, new Response.Listener<JSONArray>() {
                @Override
                public void onResponse(JSONArray response) {
                    for(int i=0;i<response.length();i++){
                        try {
                            String location = response.getJSONObject(i).get("address") == null ? "" : response.getJSONObject(i).get("address").toString();
                            Task task = new Task(response.getJSONObject(i).get("taskListID").toString(), response.getJSONObject(i).get("taskName").toString(),
                                    location, response.getJSONObject(i).get("taskDescription").toString(), response.getJSONObject(i).get("taskType").toString());
                            tasks.add(task);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }

                    taskAdapter.setTasks(tasks);
                }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
//                    Toast.makeText(getContext(), "Get Task Error"+error, Toast.LENGTH_SHORT).show();
                }
            });

            RequestQueueSingleton.getInstance(getContext()).addToRequestQueue(jsonArrayRequest);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void deleteData(String taskId) {
        try {
            FirebaseUser firebaseUser = FirebaseAuth.getInstance().getCurrentUser();
            String url = "http://40.78.89.252:3000/task/delete/\"";
            url += firebaseUser.getUid() + "\"/\"";
            url += taskId + "\"/\"";
            url += taskListId + "\"";

            Log.d("deleteURL", url);


                    JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.DELETE, url, null,
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
                            Log.d("delete", "Success");
                        }
                    }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Toast.makeText(getContext(), "Could not delete task", Toast.LENGTH_SHORT).show();
                }
            });

            RequestQueueSingleton.getInstance(getContext()).addToRequestQueue(jsonObjectRequest);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
