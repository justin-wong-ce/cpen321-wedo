package com.example.cpen321_wedo;


import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.ItemTouchHelper;
import androidx.recyclerview.widget.RecyclerView;
import androidx.recyclerview.widget.StaggeredGridLayoutManager;

import com.example.cpen321_wedo.Adapter.RecyclerViewAdapter;
import com.example.cpen321_wedo.Models.TaskList;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.android.material.snackbar.Snackbar;
import com.google.firebase.auth.FirebaseAuth;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class TaskListActivity extends AppCompatActivity{

    FloatingActionButton fab;

    List<TaskList> lstTaskList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_task_list);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle("TaskList");

        fab = findViewById(R.id.fab_tasklist);

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

        RecyclerView myrv = findViewById(R.id.recyclerview_id);
        final RecyclerViewAdapter myAdapter = new RecyclerViewAdapter(this, lstTaskList);
        myrv.setLayoutManager((new StaggeredGridLayoutManager(1, 1)));

        myrv.setAdapter(myAdapter);

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

            }
        });

        itemTouchHelper.attachToRecyclerView(myrv);


        // fab button clicked:
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(TaskListActivity.this, AddTaskListActivity.class);
                startActivity(intent);
            }
        });
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.memu, menu);
        return true;
    }

    @SuppressLint("NonConstantResourceId")
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

}
