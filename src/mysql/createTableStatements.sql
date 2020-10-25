CREATE TABLE User (
	userID				int,
	isPremium			boolean DEFAULT false,
	userName            char(100) NOT NULL,
	password            char(100) NOT NULL,
	PRIMARY KEY (userID)
)

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
	FOREIGN KEY (userID) REFERENCES User(userID)
		ON DELETE CASCADE
		ON UPDATE CASCADE
)

CREATE TABLE TaskHasTaskList (
	taskID				int,
	chatID				int NOT NULL,
	taskBudget			int,
	taskDescription		TEXT,
	address				TEXT,
	taskName  			char(100),
	taskListID			int NOT NULL,
	UNIQUE				(taskListID),
	UNIQUE				(chatID),
	PRIMARY KEY 		(taskID),
	FOREIGN KEY (taskListID) REFERENCES TaskListWithOwner(taskListID)
		ON DELETE CASCADE
		ON UPDATE CASCADE
)



CREATE TABLE HasAccess (
	userID				int,
	taskListID			int,
	PRIMARY KEY (userID, taskListID),
	FOREIGN KEY (userID) REFERENCES User(userID)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (taskListID) REFERENCES TaskListWithOwner(taskListID)
		ON DELETE CASCADE
		ON UPDATE CASCADE
)
