CREATE TABLE User (
	userID				char(50),
	isPremium			boolean DEFAULT false,
	token               char(170),
	preferences			TEXT,
	PRIMARY KEY (userID)
);

CREATE TABLE TaskListWithOwner (
	taskListID 			char(150),
	taskListName 		char(100),
	modifiedTime	 	datetime,
	createdTime			datetime,
	taskListDescription TEXT,
	owner				char(50) NOT NULL,
	PRIMARY KEY (taskListID),
	UNIQUE (owner),
	FOREIGN KEY (owner) REFERENCES User(userID)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE TaskHasTaskList (
	taskID				char(200),
	createdBy			char(50),
	taskBudget			int,
	taskDescription		TEXT,
	taskType			char(50),
	address				TEXT,
	done				boolean,
	doneBy				char(50),
	taskRating			int,
	createdTime			datetime,
	modifiedTime	datetime,
	taskName  			char(100),
	taskListID			char(150) NOT NULL,
	UNIQUE				(taskListID),
	PRIMARY KEY 		(taskID),
	FOREIGN KEY (taskListID) REFERENCES TaskListWithOwner(taskListID)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (createdBy) REFERENCES User(userID)
		ON DELETE SET NULL
		ON UPDATE CASCADE,
	FOREIGN KEY (doneBy) REFERENCES User(userID)
		ON DELETE SET NULL
		ON UPDATE CASCADE
);

CREATE TABLE HasAccess (
	userID				char(50),
	taskListID			char(150),
	PRIMARY KEY (userID, taskListID),
	FOREIGN KEY (userID) REFERENCES User(userID)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (taskListID) REFERENCES TaskListWithOwner(taskListID)
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