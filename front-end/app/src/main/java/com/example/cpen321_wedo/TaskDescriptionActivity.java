package com.example.cpen321_wedo;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

import org.w3c.dom.Text;

public class TaskDescriptionActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_task_description);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        Intent intent = getIntent();

        TextView taskType = findViewById(R.id.taskTypeText);
        TextView taskDescription = findViewById(R.id.taskDescriptionText);
        TextView taskLocation = findViewById(R.id.taskLocationText);
        TextView taskLocationLabel = findViewById(R.id.taskLocationInfo);

        getSupportActionBar().setTitle(intent.getStringExtra("title"));
        taskType.setText(intent.getStringExtra("taskType"));
        taskDescription.setText(intent.getStringExtra("taskDescription"));

        String location = intent.getStringExtra("taskLocation");

        if (!location.equals("")) {
            taskLocation.setText(location);
            taskLocationLabel.setVisibility(View.VISIBLE);
            taskLocation.setVisibility(View.VISIBLE);
        }
    }
}