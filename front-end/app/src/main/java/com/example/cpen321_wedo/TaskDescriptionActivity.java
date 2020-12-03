package com.example.cpen321_wedo;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;

public class TaskDescriptionActivity extends AppCompatActivity {

    private int position;
    private String title;
    private String type;
    private String description;
    private String location;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_task_description);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        Intent intent = getIntent();
        position = intent.getIntExtra("index", 0);

        TextView taskType = findViewById(R.id.taskTypeText);
        TextView taskDescription = findViewById(R.id.taskDescriptionText);
        TextView taskLocation = findViewById(R.id.taskLocationText);
        TextView taskLocationLabel = findViewById(R.id.taskLocationInfo);

        title = intent.getStringExtra("title");
        type = intent.getStringExtra("taskType");
        description = intent.getStringExtra("taskDescription");
        location = intent.getStringExtra("taskLocation");

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

            TextView taskType = findViewById(R.id.taskTypeText);
            TextView taskDescription = findViewById(R.id.taskDescriptionText);
            TextView taskLocation = findViewById(R.id.taskLocationText);
            TextView taskLocationLabel = findViewById(R.id.taskLocationInfo);

            if (reply[0] != null && !reply[0].equals("")) {
                getSupportActionBar().setTitle(reply[0]);
            }

            if (reply[2] != null && !reply[0].equals("")) {
                taskDescription.setText(reply[2]);
            }

            if (reply[3] != null && !reply[0].equals("")) {
                taskType.setText(reply[3]);
            }

            String location = reply[1];

            if (!location.equals("") && location != null) {
                taskLocation.setText(location);
                taskLocationLabel.setVisibility(View.VISIBLE);
                taskLocation.setVisibility(View.VISIBLE);
            }

            Intent intent = new Intent();
            intent.putExtra("taskUpdate", reply);
            intent.putExtra("index", position);
            setResult(RESULT_OK, intent);
        }
    }
}