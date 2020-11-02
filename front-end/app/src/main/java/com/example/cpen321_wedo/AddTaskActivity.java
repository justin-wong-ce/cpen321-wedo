package com.example.cpen321_wedo;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import com.rengwuxian.materialedittext.MaterialEditText;

public class AddTaskActivity extends AppCompatActivity {

    private MaterialEditText taskName;
    private MaterialEditText location;
    private MaterialEditText description;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_task);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle("Add Task");

        taskName = findViewById(R.id.taskNameText);
        location = findViewById(R.id.taskStartLocationText);
        description = findViewById(R.id.taskDescriptionText);

        Button saveBtn = findViewById(R.id.addTaskSaveButton);
        saveBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

            }
        });
    }
}