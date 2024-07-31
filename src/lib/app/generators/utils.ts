import { app } from '../app';
import type { Team } from '../team';

export const list = (n: number) => Array(n).fill(undefined);

const org = app.organization;

export const getRandom = (items: string[]): string =>
	items[Math.floor(Math.random() * items.length)];

export const getProjectId = () => {
	const ids: string[] = org.projectIds;
	return getRandom(ids);
};

export const getProjectById = (id: string) => org.project(id);

export const getProject = () => {
	const id = getProjectId();
	return org.project(id);
};

export const getTeam = () => {
	const ids: string[] = org.teamIds;
	const id = getRandom(ids);
	const team = org.team(id);
	return team;
};

export const getTeamMemberId = (team: Team) => {
	const ids: string[] = team.memberIds;
	return getRandom(ids);
};

export const getOrgMemberId = () => {
	const ids: string[] = org.memberIds;
	return getRandom(ids);
};

export const getOrgFeatureId = () => {
	const ids: string[] = org.backlog.featureIds;
	return getRandom(ids);
};

export const getFeatureId = (team: Team) => {
	const ids: string[] = team.backlog.featureIds;
	return getRandom(ids);
};
