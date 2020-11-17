CREATE TABLE Users (
	userID				char(50),
	isPremium			boolean DEFAULT false,
	token               char(170),
	preferences			TEXT,
	PRIMARY KEY (userID)
);

CREATE TABLE TaskListWithOwner (
	taskListID 			char(150),
	userID				char(50) NOT NULL,
	taskListName 		char(100),
	modifiedTime	 	datetime,
	createdTime			datetime,
	taskListDescription TEXT,
	PRIMARY KEY (taskListID),
	FOREIGN KEY (userID) REFERENCES Users(userID)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE TaskHasTaskList (
	taskID				char(200),
	createdBy			char(50),
	taskBudget			int,
	taskDescription		TEXT,
	taskType			char(50),
	priorityLevel		int NOT NULL DEFAULT 0, 
	address				TEXT,
	done				boolean,
	assignedTo			char(50),
	taskRating			int,
	createdTime			datetime,
	modifiedTime	datetime,
	taskName  			char(100),
	taskListID			char(150) NOT NULL,
	PRIMARY KEY 		(taskID),
	FOREIGN KEY (taskListID) REFERENCES TaskListWithOwner(taskListID)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (createdBy) REFERENCES Users(userID)
		ON DELETE SET NULL
		ON UPDATE CASCADE,
	FOREIGN KEY (assignedTo) REFERENCES Users(userID)
		ON DELETE SET NULL
		ON UPDATE CASCADE
);

CREATE TABLE HasAccess (
	userID				char(50),
	taskListID			char(150),
	PRIMARY KEY (userID, taskListID),
	FOREIGN KEY (userID) REFERENCES Users(userID)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (taskListID) REFERENCES TaskListWithOwner(taskListID)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE UserPreferences (
	userID				char(50) NOT NULL,
	shopping			int DEFAULT 0,
	transport			int DEFAULT 0,
	eventSetup			int DEFAULT 0,
	mechanical			int DEFAULT 0,
	writing				int DEFAULT 0,
	PRIMARY KEY 		(userID),
	FOREIGN KEY (userID) REFERENCES Users(userID)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

-- CREATE TABLE Starred (
-- 	userID				char(50),
-- 	taskID				char(200),
-- 	PRIMARY KEY (userID, taskID),
-- 	FOREIGN KEY (userID) REFERENCES User(userID)
-- 		ON DELETE CASCADE
-- 		ON UPDATE CASCADE,
-- 	FOREIGN KEY (taskID) REFERENCES TaskHasTaskList(taskID)
-- 		ON DELETE CASCADE
-- 		ON UPDATE CASCADE
-- );