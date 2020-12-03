package com.example.cpen321_wedo;

import android.view.View;

import androidx.test.core.app.ActivityScenario;
import androidx.test.espresso.PerformException;
import androidx.test.espresso.UiController;
import androidx.test.espresso.ViewAction;
import androidx.test.espresso.util.HumanReadables;
import androidx.test.espresso.util.TreeIterables;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;


import org.hamcrest.Matcher;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.util.concurrent.TimeoutException;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.typeText;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.RootMatchers.withDecorView;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.isRoot;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.not;

/**
 * Test of the add task list use case
 */

@RunWith(AndroidJUnit4.class)
public class AddTaskListTest {
    @Rule
    public ActivityScenarioRule<TaskListActivity> activityRule =
            new ActivityScenarioRule<>(TaskListActivity.class);

    private View decorView;

    @Before
    public void setUp() {
        activityRule.getScenario().onActivity(new ActivityScenario.ActivityAction<TaskListActivity>() {
            @Override
            public void perform(TaskListActivity activity) {
                decorView = activity.getWindow().getDecorView();
            }
        });
    }

    @Test
    public void checkAddTaskList() {
        // Check root layout of task list screen is displayed.
        onView(isRoot()).perform(waitDisplayed(R.id.taskListActivityLayout, 5000));
        onView(withId(R.id.taskListActivityLayout)).check(matches(isDisplayed()));

        // Click the '+' button, check the add task list activity is displayed.
        onView(withId(R.id.fab_tasklist)).perform(click());

        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        onView(withId(R.id.addTaskListLayout)).check(matches(isDisplayed()));

        // Press the Add Tasklist without filling any fields. Check correct toast message is displayed.
        onView(withId(R.id.btn_add_tasklist)).perform(click());
        onView(withText("Must fill required fields")).inRoot(withDecorView(not(decorView)))
                .check(matches(isDisplayed()));

        // Fill in the required text fields. Press the Add Tasklist button. Check that the
        // current activity is the task list activity from before.
        onView(withId(R.id.tasklist_name)).perform(typeText("test4"));
        onView(withId(R.id.tasklist_description)).perform(typeText("Description"));

        onView(withId(R.id.btn_add_tasklist)).perform(click());

        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        onView(withId(R.id.taskListActivityLayout)).check(matches(isDisplayed()));

        // Check the task list we just added is displayed with the name inputted before.
        onView(allOf(withId(R.id.tasklist_title_id), withText("test4"))).check(matches(isDisplayed()));
    }

    /**
     * Perform action of waiting for a specific view id to be displayed.
     * @param viewId The id of the view to wait for.
     * @param millis The timeout of until when to wait for.
     */
    public static ViewAction waitDisplayed(final int viewId, final long millis) {
        return new ViewAction() {
            @Override
            public Matcher<View> getConstraints() {
                return isRoot();
            }

            @Override
            public String getDescription() {
                return "wait for a specific view with id <" + viewId + "> has been displayed during " + millis + " millis.";
            }

            @Override
            public void perform(final UiController uiController, final View view) {
                uiController.loopMainThreadUntilIdle();
                final long startTime = System.currentTimeMillis();
                final long endTime = startTime + millis;
                final Matcher<View> matchId = withId(viewId);
                final Matcher<View> matchDisplayed = isDisplayed();

                do {
                    for (View child : TreeIterables.breadthFirstViewTraversal(view)) {
                        if (matchId.matches(child) && matchDisplayed.matches(child)) {
                            return;
                        }
                    }

                    uiController.loopMainThreadForAtLeast(50);
                }
                while (System.currentTimeMillis() < endTime);

                // timeout happens
                throw new PerformException.Builder()
                        .withActionDescription(this.getDescription())
                        .withViewDescription(HumanReadables.describe(view))
                        .withCause(new TimeoutException())
                        .build();
            }
        };
    }
}
