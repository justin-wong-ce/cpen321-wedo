package com.example.cpen321_wedo.adapter;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Paint;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.example.cpen321_wedo.TaskDescriptionActivity;
import com.example.cpen321_wedo.models.Task;
import com.example.cpen321_wedo.R;
import com.example.cpen321_wedo.singleton.RequestQueueSingleton;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

import static androidx.core.app.ActivityCompat.startActivityForResult;

public class TaskAdapter extends RecyclerView.Adapter<TaskAdapter.ViewHolder> {

    private static final int TASK_ITEM = -1;
    private static final int TASK_ITEM_CHECKBOX = -2;
    private ArrayList<Task> tasks;
    private final ArrayList<Task> toDelete;
    private int currentView;
    private int taskSelected;
    private Menu menu;
    private Context context;
    private Activity taskActivity;
    private String taskListId;

    public TaskAdapter(Context context, Activity taskActivity, String taskListId) {
        tasks = new ArrayList<>();
        currentView = TASK_ITEM;
        toDelete = new ArrayList<>();
        taskSelected = 0;
        this.context = context;
        this.taskActivity = taskActivity;
        this.taskListId = taskListId;
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

        return new ViewHolder(view, viewType);
    }

    @SuppressLint("SetTextI18n")
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
                    Boolean isCompleted = !tasks.get(position).isCompleted();

                    if (isCompleted) {
                        updateCompletionData(isCompleted, 3, taskListId, tasks.get(position).getTaskId(), position, tasks.get(position).getTaskType());
                    } else {
                        updateCompletionData(isCompleted, 0, taskListId, tasks.get(position).getTaskId(), position, tasks.get(position).getTaskType());
                    }
                }
            });

            holder.parent.setOnClickListener(new View.OnClickListener() {

                @Override
                public void onClick(View view) {
                    Intent intent = new Intent(context, TaskDescriptionActivity.class);
                    intent.putExtra("title", tasks.get(position).getTaskName());
                    intent.putExtra("taskType", tasks.get(position).getTaskType());
                    intent.putExtra("taskDescription", tasks.get(position).getTaskDescription());
                    intent.putExtra("taskLocation", tasks.get(position).getTaskLocation());
                    intent.putExtra("taskId", tasks.get(position).getTaskId());
                    intent.putExtra("index", position);
                    intent.putExtra("taskListId", taskListId);
                    startActivityForResult(taskActivity, intent, 2, null);
                }
            });
        } else {
            if (tasks.get(position).isCompleted()) {
                holder.taskName.setPaintFlags(holder.taskName.getPaintFlags() | Paint.STRIKE_THRU_TEXT_FLAG);
            } else {
                holder.taskName.setPaintFlags(holder.taskName.getPaintFlags() & ~Paint.STRIKE_THRU_TEXT_FLAG);
            }
            holder.checkbox.setChecked(false);
            menu.findItem(R.id.trash).setEnabled(false);


            holder.checkbox.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
                @Override
                public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                    if (b) {
                        toDelete.add(tasks.get(position));
                        taskSelected++;
                    } else {
                        toDelete.remove(tasks.get(position));
                        taskSelected--;
                    }

                    if (taskSelected == 0) {
                        menu.findItem(R.id.trash).setEnabled(false);
                    } else {
                        menu.findItem(R.id.trash).setEnabled(true);
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

    public void updateTask(String taskName, String taskType, String taskDescription, String taskLocation, long dateModifiedInMilliSeconds, int position) {
        Task task = this.tasks.get(position);
        task.setTaskName(taskName);
        task.setTaskType(taskType);
        task.setTaskDescription(taskDescription);
        task.setTaskLocation(taskLocation);
        task.setDateModifiedInMilliSeconds(dateModifiedInMilliSeconds);
        notifyItemChanged(position);
    };

    public void deleteTasksSelected() {
        for (int i = 0; i < toDelete.size(); i++) {
            tasks.remove(toDelete.get(i));
        }

        toDelete.clear();
        notifyDataSetChanged();
    }

    public ArrayList<Task> getDeleteTasks() {
        return this.toDelete;
    }

    public void setMenu(Menu menu) {
        this.menu = menu;
    }

    private void updateCompletionData(final Boolean isComplete, int rating, String taskListId, String taskId, final int position, String taskType) {
        JSONObject object = new JSONObject();
        FirebaseUser firebaseUser = FirebaseAuth.getInstance().getCurrentUser();

        Date tempDate = new Date();
        final long dateModified = tempDate.getTime();

        try {
            Date date = new Date(dateModified);
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            int year = calendar.get(Calendar.YEAR);
            int month = calendar.get(Calendar.MONDAY) + 1;
            int day = calendar.get(Calendar.DAY_OF_MONTH);
            String dayToString;
            if (day < 10) {
                dayToString = "0" + day;
            } else {
                dayToString = "" + day;
            }

            String dateModifiedString = "" + year + "-" + month + "-" + dayToString;
            object.put("taskID", taskId);
            object.put("taskListID", taskListId);
            object.put("userID", firebaseUser.getUid());
            object.put("done", isComplete);
            object.put("taskRating", rating);
            object.put("modifiedTime", dateModifiedString);
            object.put("taskType", taskType);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        try {
            String url = "http://40.78.89.252:3000/task/update";

            JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.PUT, url, object,
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
                            tasks.get(position).setCompleted(isComplete);
                            notifyItemChanged(position);
                        }
                    }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Toast.makeText(context, "Could not mark done/undone: "+ error, Toast.LENGTH_SHORT).show();
                }
            });

            RequestQueueSingleton.getInstance(context).addToRequestQueue(jsonObjectRequest);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {

        private final TextView taskName;
        private Button markDone;
        private CheckBox checkbox;
        private RelativeLayout parent;

        public ViewHolder(@NonNull View itemView, int viewType) {
            super(itemView);
            taskName = itemView.findViewById(R.id.taskName);
            parent = itemView.findViewById(R.id.taskParent);
            if (viewType == TASK_ITEM) {
                markDone = itemView.findViewById(R.id.doneBtn);
            } else {
                checkbox = itemView.findViewById(R.id.taskCheckbox);
            }

        }
    }
}
