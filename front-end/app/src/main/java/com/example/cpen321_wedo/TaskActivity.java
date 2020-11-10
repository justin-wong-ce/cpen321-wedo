package com.example.cpen321_wedo;


import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;
import androidx.viewpager.widget.ViewPager;

import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;

import com.example.cpen321_wedo.models.Task;
import com.example.cpen321_wedo.fragments.UserFragment;
import com.example.cpen321_wedo.fragments.TaskFragment;
import com.google.android.material.tabs.TabLayout;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.messaging.FirebaseMessaging;

import java.util.ArrayList;

public class TaskActivity extends AppCompatActivity {

    private TaskFragment taskFragment;
    private boolean isDeletePressed;
    private Menu taskMenu;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_task_);

        // TODO: delete later:
        FirebaseMessaging.getInstance().setAutoInitEnabled(true);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle("Task");

        TabLayout tabLayout = findViewById(R.id.tab_layout);
        ViewPager viewPager = findViewById(R.id.view_pager);
        ViewPagerAdapter viewPagerAdapter = new ViewPagerAdapter(getSupportFragmentManager());

        taskFragment = new TaskFragment();
        isDeletePressed = false;

        viewPagerAdapter.addFragment(taskFragment, "Tasks");
        viewPagerAdapter.addFragment(new UserFragment(), "Chat");

        viewPager.setAdapter(viewPagerAdapter);
        tabLayout.setupWithViewPager(viewPager);

    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.task_activity_menu, menu);
        taskMenu = menu;
        menu.setGroupVisible(R.id.taskDefaultMenu, true);
        menu.setGroupVisible(R.id.taskDeleteMenu, false);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        switch (item.getItemId()){
            case R.id.logout:
                FirebaseAuth.getInstance().signOut();
                startActivity(new Intent(TaskActivity.this, StartActivity.class));
                finish();
                return true;
            case R.id.add:
                Intent intent = new Intent(this, AddTaskActivity.class);
                startActivityForResult(intent, 1);
                return true;
            case R.id.delete:
                taskMenu.setGroupVisible(R.id.taskDefaultMenu, false);
                taskMenu.setGroupVisible(R.id.taskDeleteMenu, true);
                taskFragment.toggleItemViewType();
                return true;
            case R.id.trash:
                taskFragment.deleteTasksSelected();
                taskMenu.setGroupVisible(R.id.taskDefaultMenu, true);
                taskMenu.setGroupVisible(R.id.taskDeleteMenu, false);
                taskFragment.toggleItemViewType();
                return true;
            case R.id.cancel_delete:
                taskMenu.setGroupVisible(R.id.taskDefaultMenu, true);
                taskMenu.setGroupVisible(R.id.taskDeleteMenu, false);
                taskFragment.toggleItemViewType();
                return true;
        }
        return false;
    }

    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == 1) {
            if (resultCode == RESULT_OK) {
                String[] reply = data.getStringArrayExtra("task");

                Task task = new Task(reply[0], reply[1], reply[2]);
                taskFragment.addTask(task);
            }
        }
    }

    class ViewPagerAdapter extends FragmentPagerAdapter {

        private ArrayList<Fragment> fragments;
        private ArrayList<String> titles;

        ViewPagerAdapter(FragmentManager fm){
            super(fm);
            this.fragments = new ArrayList<Fragment>();
            this.titles = new ArrayList<String>();
        }
        @NonNull
        @Override
        public Fragment getItem(int position) {
            return fragments.get(position);
        }

        @Override
        public int getCount() {
            return fragments.size();
        }

        public void addFragment(Fragment fragment, String title){
            fragments.add(fragment);
            titles.add(title);
        }

        @Nullable
        @Override
        public CharSequence getPageTitle(int position) {
            return titles.get(position);
        }
    }
}