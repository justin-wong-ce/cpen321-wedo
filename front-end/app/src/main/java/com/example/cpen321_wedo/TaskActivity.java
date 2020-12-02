package com.example.cpen321_wedo;


import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;
import androidx.viewpager.widget.ViewPager;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.example.cpen321_wedo.models.Task;
import com.example.cpen321_wedo.fragments.UserFragment;
import com.example.cpen321_wedo.fragments.TaskFragment;
import com.example.cpen321_wedo.singleton.RequestQueueSingleton;
import com.google.android.material.tabs.TabLayout;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.messaging.FirebaseMessaging;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

public class TaskActivity extends AppCompatActivity {

    private TaskFragment taskFragment;
    private Menu taskMenu;
    private String taskListId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_task_);

        // TODO: delete later:
        FirebaseMessaging.getInstance().setAutoInitEnabled(true);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle("Task");

        TabLayout tabLayout = findViewById(R.id.tab_layout);
        ViewPager viewPager = findViewById(R.id.view_pager);
        ViewPagerAdapter viewPagerAdapter = new ViewPagerAdapter(getSupportFragmentManager());

        Intent intent = getIntent();
        taskListId = intent.getStringExtra("taskListId");
        taskFragment = new TaskFragment(intent.getStringExtra("taskListId"));

        viewPagerAdapter.addFragment(taskFragment, "Tasks");
        viewPagerAdapter.addFragment(new UserFragment(), "Chat");

        viewPager.setAdapter(viewPagerAdapter);
        tabLayout.setupWithViewPager(viewPager);

    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.task_activity_menu, menu);
        taskMenu = menu;
        menu.setGroupVisible(R.id.taskDefaultMenu, true);
        menu.setGroupVisible(R.id.taskDeleteMenu, false);
        taskFragment.setMenu(menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        switch (item.getItemId()){
            case R.id.logout:
                FirebaseAuth.getInstance().signOut();
                startActivity(new Intent(TaskActivity.this, StartActivity.class));
                finish();
                return true;
            case R.id.add:
                Intent intent = new Intent(this, AddTaskActivity.class);
                startActivityForResult(intent, 1);
                return true;
            case R.id.delete:
                taskMenu.setGroupVisible(R.id.taskDefaultMenu, false);
                taskMenu.setGroupVisible(R.id.taskDeleteMenu, true);
                taskFragment.toggleItemViewType();
                return true;
            case R.id.trash:
                taskFragment.deleteTasksSelected();
                taskMenu.setGroupVisible(R.id.taskDefaultMenu, true);
                taskMenu.setGroupVisible(R.id.taskDeleteMenu, false);
                taskFragment.toggleItemViewType();
                return true;
            case R.id.cancel_delete:
                taskMenu.setGroupVisible(R.id.taskDefaultMenu, true);
                taskMenu.setGroupVisible(R.id.taskDeleteMenu, false);
                taskFragment.toggleItemViewType();
                return true;
            default:
                break;
        }
        return false;
    }

    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == 1 && resultCode == RESULT_OK) {

            final String[] reply = data.getStringArrayExtra("task");

            postData(reply[0], reply[1], reply[2], reply[3]);
        }
    }

    private void postData(final String taskName, final String taskLocation, final String taskDescription, final String taskType) {
        JSONObject object = new JSONObject();
        FirebaseUser firebaseUser = FirebaseAuth.getInstance().getCurrentUser();
        Task task = new Task(firebaseUser.getUid() , taskName, taskLocation, taskDescription, taskType);
        final String postTaskId = task.getTaskId();

        try {
            Date date = new Date(task.getDateCreatedInMilliSeconds());
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

            String createdTime = "" + year + "-" + month + "-" + dayToString;
            object.put("taskID", task.getTaskId());
            object.put("taskDescription", task.getTaskDescription());
            object.put("taskType", task.getTaskType());
            object.put("taskListID", taskListId);
            object.put("userID", firebaseUser.getUid());
            object.put("taskName", task.getTaskName());
            object.put("createdTime", createdTime);
            object.put("address", task.getTaskLocation());
            object.put("modifiedTime", createdTime);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        try {
            String url = "http://40.78.89.252:3000/task/create";

            JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, url, object,
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
                            FirebaseUser firebaseUser = FirebaseAuth.getInstance().getCurrentUser();
                            Task postTask = new Task(firebaseUser.getUid() , taskName, taskLocation, taskDescription, taskType);
                            postTask.setTaskId(postTaskId);
                            taskFragment.addTask(postTask);
                        }
                    }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Toast.makeText(getApplicationContext(), "Could not create task", Toast.LENGTH_SHORT).show();
                }
            });

            RequestQueueSingleton.getInstance(getApplicationContext()).addToRequestQueue(jsonObjectRequest);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    class ViewPagerAdapter extends FragmentPagerAdapter {

        private ArrayList<Fragment> fragments;
        private ArrayList<String> titles;

        ViewPagerAdapter(FragmentManager fm){
            super(fm);
            this.fragments = new ArrayList<Fragment>();
            this.titles = new ArrayList<String>();
        }
        @NonNull
        @Override
        public Fragment getItem(int position) {
            return fragments.get(position);
        }

        @Override
        public int getCount() {
            return fragments.size();
        }

        public void addFragment(Fragment fragment, String title){
            fragments.add(fragment);
            titles.add(title);
        }

        @Nullable
        @Override
        public CharSequence getPageTitle(int position) {
            return titles.get(position);
        }
    }
}