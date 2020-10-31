package com.example.cpen321_wedo;


import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.firebase.auth.FirebaseAuth;

import java.util.ArrayList;
import java.util.List;

public class TaskListActivity extends AppCompatActivity implements TaskListClickedListener {

    List<TaskList> lstTaskList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_task_list);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle("TaskList");


        lstTaskList = new ArrayList<>();
        lstTaskList.add(new TaskList("Getting Enrique out of our team", 4, "Angry", "form a new groud of size 3", R.drawable.thevigitarian));
        lstTaskList.add(new TaskList("What the heck", 3, "Angry", "I don't know bro", R.drawable.hediedwith));
        lstTaskList.add(new TaskList("Panic F", 7, "Angry", "So much hw", R.drawable.mariasemples));
        lstTaskList.add(new TaskList("Where am I from", 9, "Unknown", "This is a description for this unknown quesiton, fffffffffff", R.drawable.thewildrobot));
        lstTaskList.add(new TaskList("Who am I", 2, "Unknown", "IDK? You are a pig", R.drawable.hediedwith));
        lstTaskList.add(new TaskList("Where will I go", 4, "Unknown", "Go to the hell", R.drawable.mariasemples));
        lstTaskList.add(new TaskList("Getting Enrique out of our team", 4, "Angry", "form a new groud of size 3", R.drawable.thevigitarian));
        lstTaskList.add(new TaskList("What the heck", 3, "Angry", "I don't know bro", R.drawable.hediedwith));
        lstTaskList.add(new TaskList("Panic F", 7, "Angry", "So much hw", R.drawable.mariasemples));
        lstTaskList.add(new TaskList("Where am I from", 9, "Unknown", "This is a description for this unknown quesiton, fffffffffff", R.drawable.thewildrobot));
        lstTaskList.add(new TaskList("Who am I", 2, "Unknown", "IDK? You are a pig", R.drawable.hediedwith));
        lstTaskList.add(new TaskList("Where will I go", 4, "Unknown", "Go to the hell", R.drawable.mariasemples));
        lstTaskList.add(new TaskList("Getting Enrique out of our team", 4, "Angry", "form a new groud of size 3", R.drawable.thevigitarian));
        lstTaskList.add(new TaskList("What the heck", 3, "Angry", "I don't know bro", R.drawable.hediedwith));
        lstTaskList.add(new TaskList("Panic F", 7, "Angry", "So much hw", R.drawable.mariasemples));
        lstTaskList.add(new TaskList("Where am I from", 9, "Unknown", "This is a description for this unknown quesiton, fffffffffff", R.drawable.thewildrobot));
        lstTaskList.add(new TaskList("Who am I", 2, "Unknown", "IDK? You are a pig", R.drawable.hediedwith));
        lstTaskList.add(new TaskList("Where will I go", 4, "Unknown", "Go to the hell", R.drawable.mariasemples));
        lstTaskList.add(new TaskList("Getting Enrique out of our team", 4, "Angry", "form a new groud of size 3", R.drawable.thevigitarian));
        lstTaskList.add(new TaskList("What the heck", 3, "Angry", "I don't know bro", R.drawable.hediedwith));
        lstTaskList.add(new TaskList("Panic F", 7, "Angry", "So much hw", R.drawable.mariasemples));
        lstTaskList.add(new TaskList("Where am I from", 9, "Unknown", "This is a description for this unknown quesiton, fffffffffff", R.drawable.thewildrobot));
        lstTaskList.add(new TaskList("Who am I", 2, "Unknown", "IDK? You are a pig", R.drawable.hediedwith));
        lstTaskList.add(new TaskList("Where will I go", 4, "Unknown", "Go to the hell", R.drawable.mariasemples));

        RecyclerView myrv = (RecyclerView) findViewById(R.id.recyclerview_id);
        RecyclerViewAdapter myAdapter = new RecyclerViewAdapter(this, lstTaskList);
        myAdapter.setClickListener(this);
        myrv.setLayoutManager((new GridLayoutManager(this, 3)));
        myrv.setAdapter(myAdapter);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.memu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        switch (item.getItemId()){
            case R.id.logout:
                FirebaseAuth.getInstance().signOut();
                startActivity(new Intent(TaskListActivity.this, StartActivity.class));
                finish();
                return true;
        }
        return false;
    }

    @Override
    public void itemClicked() {
        Intent intent = new Intent(TaskListActivity.this, TaskActivity.class);
        startActivity(intent);
    }
}
