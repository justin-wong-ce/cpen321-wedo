CREATE TABLE TaskListWithOwner (
	taskListID 			int,
	taskListName 		char(100),
	lastModifiedTime 	datetime,
	timeCreated 		datetime,
	chatID				int,
	userID				int,
	userCap				int,
	PRIMARY KEY (taskListID),
	FOREIGN KEY (userID) REFERENCES User
		ON DELETE CASCADE
		ON UPDATE CASCADE
)

CREATE TABLE TaskHasTaskList (
	taskID				int,
	chatID				int,
	taskBudget			int,
	taskDescription		char(1000),
	address				char(600),
	taskName  			char(100),
	taskListID			int,
	FOREIGN KEY (taskListID) REFERENCES TaskListWithOwner
		ON DELETE CASCADE
		ON UPDATE CASCADE
)

CREATE TABLE User (
	userID				int,
	isPremium			boolean
)

CREATE TABLE HasAccess (
	userID				int,
	taskListID			int,
	userCap				smallint
)