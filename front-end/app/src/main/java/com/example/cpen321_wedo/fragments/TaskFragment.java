package com.example.cpen321_wedo.fragments;

import android.os.Bundle;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.example.cpen321_wedo.adapter.TaskAdapter;
import com.example.cpen321_wedo.models.Task;
import com.example.cpen321_wedo.R;

import java.util.ArrayList;

import static androidx.recyclerview.widget.RecyclerView.VERTICAL;

public class TaskFragment extends Fragment {
//<<<<<<< HEAD
//=======
//
//>>>>>>> 5f7b67a229b3ec75749abfcbc9293d1321b2b59c
    private TaskAdapter taskAdapter;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        RecyclerView taskRecyclerView;
        View view = inflater.inflate(R.layout.fragment_task, container, false);

        taskRecyclerView = view.findViewById(R.id.taskRecyclerView);
        taskRecyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        taskRecyclerView.setHasFixedSize(true);

        DividerItemDecoration itemDecor = new DividerItemDecoration(getContext(), VERTICAL);
        taskRecyclerView.addItemDecoration(itemDecor);

        ArrayList<Task> tasks = new ArrayList<>();
        tasks.add(new Task("Buy eggs", "Save on Foods, UBC" , "Go to the nearest store to buy eggs"));
        tasks.add(new Task("Finish Homework", "Koerner Library, UBC", "There is a math homework due tomorrow"));

        taskAdapter = new TaskAdapter();
        taskAdapter.setTasks(tasks);

        taskRecyclerView.setAdapter(taskAdapter);

        return view;
    }

    public void addTask(Task task) {
        taskAdapter.addTask(task);
    }

    public void toggleItemViewType () { taskAdapter.toggleItemViewType(); }

    public void deleteTasksSelected() { taskAdapter.deleteTasksSelected(); }
}
