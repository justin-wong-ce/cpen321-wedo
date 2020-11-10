package com.example.cpen321_wedo.Adapter;

import android.graphics.Paint;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.cpen321_wedo.Models.Task;
import com.example.cpen321_wedo.R;

import org.w3c.dom.Text;

import java.util.ArrayList;

public class TaskAdapter extends RecyclerView.Adapter<TaskAdapter.ViewHolder> {

    private static final int TASK_ITEM = -1;
    private static final int TASK_ITEM_CHECKBOX = -2;
    private ArrayList<Task> tasks;
    private ArrayList<Task> toDelete;
    private int currentView;

    public TaskAdapter() {
        tasks = new ArrayList<>();
        currentView = TASK_ITEM;
        toDelete = new ArrayList<>();
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view;
        if (viewType == TASK_ITEM) {
            view = LayoutInflater.from(parent.getContext()).inflate(R.layout.task_item, parent, false);
        } else {
            view = LayoutInflater.from(parent.getContext()).inflate(R.layout.task_with_checkbox_item, parent, false);
        }

        ViewHolder holder = new ViewHolder(view, viewType);

        return holder;
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, final int position) {
        holder.taskName.setText(tasks.get(position).getTaskName());

        if (currentView == TASK_ITEM) {
            if (tasks.get(position).isCompleted()) {
                holder.markDone.setText("Mark Undone");
                holder.taskName.setPaintFlags(holder.taskName.getPaintFlags() | Paint.STRIKE_THRU_TEXT_FLAG);
            } else {
                holder.markDone.setText("Mark Done");
                holder.taskName.setPaintFlags(holder.taskName.getPaintFlags() & ~Paint.STRIKE_THRU_TEXT_FLAG);
            }

            holder.markDone.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    if (tasks.get(position).isCompleted()) {
                        tasks.get(position).setCompleted(false);
                    } else {
                        tasks.get(position).setCompleted(true);
                    }

                    notifyItemChanged(position);
                }
            });
        } else {
            if (tasks.get(position).isCompleted()) {
                holder.taskName.setPaintFlags(holder.taskName.getPaintFlags() | Paint.STRIKE_THRU_TEXT_FLAG);
            } else {
                holder.taskName.setPaintFlags(holder.taskName.getPaintFlags() & ~Paint.STRIKE_THRU_TEXT_FLAG);
            }
            holder.checkbox.setChecked(false);

            holder.checkbox.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
                @Override
                public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                    if (b) {
                        toDelete.add(tasks.get(position));
                    } else {
                        toDelete.remove(tasks.get(position));
                    }
                }
            });

        }

    }

    @Override
    public int getItemViewType (int position) {
        return currentView;
    }

    public void toggleItemViewType () {
        if (currentView == TASK_ITEM){
            currentView = TASK_ITEM_CHECKBOX;
        } else {
            currentView = TASK_ITEM;
        }
        notifyDataSetChanged();
    }

    public void displayTaskWithCheckbox(){
        currentView = TASK_ITEM_CHECKBOX;
        notifyDataSetChanged();
    }

    public void displayTask(){
        currentView = TASK_ITEM;
        notifyDataSetChanged();
    }

    @Override
    public int getItemCount() {
        return tasks.size();
    }

    public void setTasks(ArrayList<Task> tasks) {
        this.tasks = tasks;
        notifyDataSetChanged();
    }

    public void addTask(Task task) {
        this.tasks.add(task);
        notifyDataSetChanged();
    }

    public void deleteTasksSelected() {
        for (int i = 0; i < toDelete.size(); i++) {
            tasks.remove(toDelete.get(i));
        }

        toDelete.clear();
        notifyDataSetChanged();
    }

    public class ViewHolder extends RecyclerView.ViewHolder {

        private TextView taskName;
        private Button markDone;
        private CheckBox checkbox;
        public ViewHolder(@NonNull View itemView, int viewType) {
            super(itemView);
            taskName = itemView.findViewById(R.id.taskName);
            if (viewType == TASK_ITEM) {
                markDone = itemView.findViewById(R.id.doneBtn);
            } else {
                checkbox = itemView.findViewById(R.id.taskCheckbox);
            }

        }
    }
}
