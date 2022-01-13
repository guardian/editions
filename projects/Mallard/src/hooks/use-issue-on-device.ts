import { useEffect, useState } from 'react';
import { isIssueOnDevice } from 'src/helpers/files';
import { useIssue } from './use-issue-provider';

export enum ExistsStatus {
	Pending,
	DoesExist,
	DoesNotExist,
}

class LocalIssueListStore {
	private issues: Map<string, ExistsStatus> = new Map();
	private subscribers: Array<() => void> = [];

	getStatus(key: string) {
		const status = this.issues.get(key);
		if (status) return status;
		this.issues.set(key, ExistsStatus.Pending);
		this.query(key);
		return ExistsStatus.Pending;
	}

	private async query(key: string) {
		const is = await isIssueOnDevice(key);
		if (this.issues.get(key)) return;
		this.issues.set(
			key,
			is ? ExistsStatus.DoesExist : ExistsStatus.DoesNotExist,
		);
		this.updateListeners();
	}

	add(key: string) {
		this.issues.set(key, ExistsStatus.DoesExist);
		this.updateListeners();
	}

	reset() {
		this.issues.forEach((_, k) =>
			this.issues.set(k, ExistsStatus.DoesNotExist),
		);
		this.updateListeners();
	}

	remove(key: string) {
		this.issues.set(key, ExistsStatus.DoesNotExist);
		this.updateListeners();
	}

	subscribe(fn: () => void) {
		this.subscribers.push(fn);
		return () => {
			this.subscribers = this.subscribers.filter((sub) => sub !== fn);
		};
	}
	updateListeners() {
		this.subscribers.forEach((sub) => sub());
	}
}

export const localIssueListStore = new LocalIssueListStore();

const useIssueOnDevice = (localId: string) => {
	const [status, setStatus] = useState(
		localIssueListStore.getStatus(localId),
	);
	const { retry } = useIssue();

	useEffect(
		() =>
			localIssueListStore.subscribe(() => {
				const newStatus = localIssueListStore.getStatus(localId);
				if (newStatus == ExistsStatus.DoesNotExist) {
					retry();
				}
				setStatus(newStatus);
			}),
		[localId],
	);

	return status;
};

export { useIssueOnDevice };
