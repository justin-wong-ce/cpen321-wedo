CREATE TABLE TaskListWithOwner (
	taskListID 			int,
	taskListName 		char(100),
	lastModifiedTime 	datetime,
	timeCreated 		datetime,
	chatID				int NOT NULL,
	userID				int NOT NULL,
	userCap				int NOT NULL,
	PRIMARY KEY (taskListID),
	UNIQUE (userID),
	UNIQUE (chatID),
	FOREIGN KEY (userID) REFERENCES User
		ON DELETE CASCADE
		ON UPDATE CASCADE
)

CREATE TABLE TaskHasTaskList (
	taskID				int,
	chatID				int NOT NULL,
	taskBudget			int,
	taskDescription		char(1000),
	address				char(600),
	taskName  			char(100),
	taskListID			int NOT NULL,
	UNIQUE				(taskListID),
	UNIQUE				(chatID),
	PRIMARY KEY 		(taskID),
	FOREIGN KEY (taskListID) REFERENCES TaskListWithOwner
		ON DELETE CASCADE
		ON UPDATE CASCADE
)

CREATE TABLE User (
	userID				int,
	isPremium			boolean,
	PRIMARY KEY (userID)
)

CREATE TABLE HasAccess (
	userID				int,
	taskListID			int,
	PRIMARY KEY (userID, taskListID)
)