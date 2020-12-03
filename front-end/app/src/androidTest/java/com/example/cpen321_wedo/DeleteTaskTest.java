package com.example.cpen321_wedo;

import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;

import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.Espresso.openActionBarOverflowOrOptionsMenu;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.ViewMatchers.isChecked;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.isEnabled;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.not;

/**
 * Test of deleting a task use case
 */
@RunWith(AndroidJUnit4.class)
public class DeleteTaskTest {

    @Rule
    public ActivityScenarioRule<TaskListActivity> activityRule =
            new ActivityScenarioRule<>(TaskListActivity.class);

    @Test
    public void checkDeleteTask() {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        onView(allOf(withId(R.id.tasklist_title_id), withText("Test"))).perform(click());

        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // Check that the task activity layout is displayed.
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        onView(withId(R.id.taskActivityLayout)).check(matches(isDisplayed()));

        // Check that the menu is displayed.
        onView(withId(R.id.toolbar)).check(matches(isDisplayed()));
        openActionBarOverflowOrOptionsMenu(InstrumentationRegistry.getInstrumentation().getTargetContext());

        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // Press the delete option. Check if checkboxes appear beside tasks, Check that the trash
        // icon is displayed and disabled.
        onView(withText("Delete")).perform(click());

        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        onView(withId(R.id.taskCheckbox)).check(matches(isDisplayed()));
        onView(withId(R.id.trash)).check(matches(isDisplayed()));
        onView(withId(R.id.trash)).check(matches(not(isEnabled())));

        onView(withId(R.id.taskCheckbox)).perform(click());
        onView(withId(R.id.taskCheckbox)).check(matches(isChecked()));
        onView(withId(R.id.trash)).check(matches(isEnabled()));

        // Press the trash icon. Check the number of tasks reduced. In this case there was only
        // one task.
        onView(withId(R.id.trash)).perform(click());

        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        onView(withId(R.id.taskRecyclerView)).check(new RecyclerViewItemCountAssertion(0));
    }


}
