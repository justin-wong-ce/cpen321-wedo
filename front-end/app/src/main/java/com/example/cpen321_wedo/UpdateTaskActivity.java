package com.example.cpen321_wedo;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

public class UpdateTaskActivity extends AppCompatActivity {
    private EditText taskName;
    private EditText location;
    private EditText description;
    private TextView taskType;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_update_task);

        Toolbar toolbar = findViewById(R.id.toolbar);
        Intent intent = getIntent();
        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle("Update Task");

        LinearLayout taskNameLayout = findViewById(R.id.updateTaskNameLayout);
        LinearLayout taskLocationLayout = findViewById(R.id.updateTaskStartLocationLayout);
        LinearLayout taskDescriptionLayout = findViewById(R.id.updateTaskDescriptionLayout);

        taskName = taskNameLayout.findViewById(R.id.updateTaskNameText);
        location = taskLocationLayout.findViewById(R.id.updateTaskStartLocationText);
        description = taskDescriptionLayout.findViewById(R.id.updateTaskDescriptionText);
        taskType = findViewById(R.id.updateFilled_exposed_dropdown);

        taskName.setText(intent.getStringExtra("taskTitle"));
        location.setText(intent.getStringExtra("taskLocation"));
        description.setText(intent.getStringExtra("taskDescription"));

        Button saveBtn = findViewById(R.id.updateTaskSaveButton);
        saveBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String task_name = taskName.getText().toString();
                String loc = location.getText().toString();
                String desc = description.getText().toString();
                String taskTypeString = taskType.getText().toString();

                Intent intent = new Intent();
                String[] taskInfo = {task_name, loc, desc, taskTypeString};
                intent.putExtra("task", taskInfo);
                setResult(RESULT_OK, intent);
                finish();
            }
        });

        String[] taskTypes = new String[] {"shopping", "transport", "setup", "repair", "study", "work", "fun"};

        ArrayAdapter<String> adapter =
                new ArrayAdapter<>(
                        getApplicationContext(),
                        R.layout.dropdown_menu_popup_item,
                        taskTypes);

        AutoCompleteTextView editTextFilledExposedDropdown = findViewById(R.id.updateFilled_exposed_dropdown);
        editTextFilledExposedDropdown.setText(intent.getStringExtra("taskType"));
        editTextFilledExposedDropdown.setAdapter(adapter);
    }
}