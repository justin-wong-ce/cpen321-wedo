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

import com.example.cpen321_wedo.login.LoginActivity;

import org.hamcrest.Matcher;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.util.concurrent.TimeoutException;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.clearText;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.typeText;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.RootMatchers.withDecorView;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.isEnabled;
import static androidx.test.espresso.matcher.ViewMatchers.isRoot;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import static org.hamcrest.Matchers.not;

/**
 * Test of the Login use case
 */
@RunWith(AndroidJUnit4.class)
public class LoginTest {

    @Rule
    public ActivityScenarioRule<LoginActivity> activityRule =
            new ActivityScenarioRule<>(LoginActivity.class);

    private View decorView;

    @Before
    public void setUp() {
        activityRule.getScenario().onActivity(new ActivityScenario.ActivityAction<LoginActivity>() {
            @Override
            public void perform(LoginActivity activity) {
                decorView = activity.getWindow().getDecorView();
            }
        });
    }



    @Test
    public void checkLogin() {
        // Check login screen is displayed.
        onView(isRoot()).perform(waitDisplayed(R.id.loginActivityLayout, 5000));
        onView(withId(R.id.loginActivityLayout)).check(matches(isDisplayed()));

        // Check login button is disabled
        onView(withId(R.id.btn_login)).check(matches(not(isEnabled())));

        // Enter any string without @, check if login button is disabled.
        onView(withId(R.id.email)).perform(typeText("test1gmail.com"));
        onView(withId(R.id.btn_login)).check(matches(not(isEnabled())));

        // Enter "whatever" as the password, check that the login button is enabled.
        onView(withId(R.id.password)).perform(typeText("whatever"));
        onView(withId(R.id.btn_login)).check(matches(isEnabled()));

        // Click the login button, check correct toast message is displayed.
        onView(withId(R.id.btn_login)).perform(click());
        onView(withText("Please enter a valid email")).inRoot(withDecorView(not(decorView)))
                .check(matches(isDisplayed()));

        // Enter an unregistered email, check login button is still enabled.
        onView(withId(R.id.email)).perform(clearText());
        onView(withId(R.id.email)).perform(typeText("test1@gmail.com"));
        onView(withId(R.id.btn_login)).check(matches(isEnabled()));

        // Press the login button, check correct toast message is displayed.
        onView(withId(R.id.btn_login)).perform(click());

        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        onView(withText("Login failed")).inRoot(withDecorView(not(decorView)))
                .check(matches(isDisplayed()));

        // Enter an correct email, check login button is still enabled.
        onView(withId(R.id.email)).perform(clearText());
        onView(withId(R.id.email)).perform(typeText("1@gmail.com"));
        onView(withId(R.id.btn_login)).check(matches(isEnabled()));

        // Press the login button, check correct toast message is displayed.
        onView(withId(R.id.btn_login)).perform(click());

        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        onView(withText("Login failed")).inRoot(withDecorView(not(decorView)))
                .check(matches(isDisplayed()));

        // Enter the correct password for the corresponding email.  Check that the login button is enabled.
        onView(withId(R.id.password)).perform(clearText());
        onView(withId(R.id.password)).perform(typeText("123456789"));
        onView(withId(R.id.btn_login)).check(matches(isEnabled()));

        // Press login, check that the task list screen is displayed.
        onView(withId(R.id.btn_login)).perform(click());
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        onView(withId(R.id.taskListActivityLayout)).check(matches(isDisplayed()));
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