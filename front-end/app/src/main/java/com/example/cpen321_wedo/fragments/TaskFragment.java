package com.example.cpen321_wedo.fragments;

import android.os.Bundle;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;

import com.example.cpen321_wedo.Adapter.TaskAdapter;
import com.example.cpen321_wedo.Models.Task;
import com.example.cpen321_wedo.R;

import java.util.ArrayList;

public class TaskFragment extends Fragment {

    private RecyclerView taskRecyclerView;
    private TaskAdapter taskAdapter;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_task, container, false);

        taskRecyclerView = view.findViewById(R.id.taskRecyclerView);
        taskRecyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        taskRecyclerView.setHasFixedSize(true);

        ArrayList<Task> tasks = new ArrayList<>();
        tasks.add(new Task("Buy eggs", "Go to the nearest store to buy eggs"));
        tasks.add(new Task("Finish Homework", "There is a math homework due tomorrow"));

        taskAdapter = new TaskAdapter();
        taskAdapter.setTasks(tasks);

        taskRecyclerView.setAdapter(taskAdapter);

        return view;
    }
}
