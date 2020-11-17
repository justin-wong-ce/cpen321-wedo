package com.example.cpen321_wedo;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Toast;

public class AddTaskActivity extends AppCompatActivity {

    private EditText taskName;
    private EditText location;
    private EditText description;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_task);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle("Add Task");

        LinearLayout taskNameLayout = findViewById(R.id.taskNameLayout);
        LinearLayout taskLocationLayout = findViewById(R.id.taskStartLocationLayout);
        LinearLayout taskDescriptionLayout = findViewById(R.id.taskDescriptionLayout);

        taskName = taskNameLayout.findViewById(R.id.taskNameText);
        location = taskLocationLayout.findViewById(R.id.taskStartLocationText);
        description = taskDescriptionLayout.findViewById(R.id.taskDescriptionText);

        Button saveBtn = findViewById(R.id.addTaskSaveButton);
        saveBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String task_name = taskName.getText().toString();
                String loc = location.getText().toString();
                String desc = description.getText().toString();

                if (task_name == null || task_name.equals("")) {
                    Toast.makeText(AddTaskActivity.this, "Please fill the required fields", Toast.LENGTH_SHORT).show();
                } else {
                    Intent intent = new Intent();
                    String[] taskInfo = {task_name, loc, desc};
                    intent.putExtra("task", taskInfo);
                    setResult(RESULT_OK, intent);
                    finish();
                }
            }
        });
    }
}