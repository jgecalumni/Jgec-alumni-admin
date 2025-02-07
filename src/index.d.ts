interface IEventType {
	id: string;
	name: string;
	shortDescription: string;
	details: string;
	event_thumbnail: string;
	date: string;
	time: string;
	location: string;
	hostName: string;
	hostDetails: string;
	schedule: [
		{
			startTime: string;
			endTime: string;
			activity: string;
		}
	];
	createdAt: string;
	updatedAt: string;
}

interface INoticeType{
	id: string,
    title: string,
    description: string,
    date: string,
    link: string,
    link_public_id: string,
    createdAt: string,
    updatedAt: string
}
