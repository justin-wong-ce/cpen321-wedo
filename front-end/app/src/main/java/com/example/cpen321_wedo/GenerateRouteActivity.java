package com.example.cpen321_wedo;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ListView;

import com.example.cpen321_wedo.adapter.GenerateTaskAdapter;
import com.example.cpen321_wedo.models.Task;

import java.util.ArrayList;
import java.util.List;

public class GenerateRouteActivity extends AppCompatActivity {

    private GenerateTaskAdapter myAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_generate_route);

        List<Task> tasks = new ArrayList<>();

        Task task1 = new Task("go to the hell", "1100 Arg 55th");
        Task task2 = new Task("go to the washroom", "fdsc 33445th");
        Task task3 = new Task("go to the jail", "01 01 01 tth");
        Task task4 = new Task("Biden wins", "BC h 44th");
        Task task5 = new Task("finish homework", "fdbrrrhl 39875");
        Task task6 = new Task("wtfffff", "dhth 57yh");
        tasks.add(task1);
        tasks.add(task2);
        tasks.add(task3);
        tasks.add(task4);
        tasks.add(task5);
        tasks.add(task6);

        myAdapter = new GenerateTaskAdapter(tasks, getLayoutInflater());

        ListView myrv = findViewById(R.id.ListViewCatalog);
        myrv.setAdapter(myAdapter);

        Button btn_generateRoute = findViewById(R.id.btn_generateRoute);
        btn_generateRoute.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {


                //TODO: add more stuff here! To call backend to generate route!
            }
        });
    }
}