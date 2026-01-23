"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type State, updateVisit } from "../../actions";

const initialState: State = { errors: {} };

type EditVisitFormProps = {
	readonly visit: {
		id: number;
		title: string;
		content: string;
	};
};

export default function EditVisitForm({ visit }: EditVisitFormProps) {
	const updateVisitAction = updateVisit.bind(null, visit.id);

	const [state, formAction, isPending] = useActionState(
		updateVisitAction,
		initialState,
	);
	const { errors } = state;

	return (
		<form action={formAction} className="space-y-6">
			<div className="space-y-2">
				<Label htmlFor="title">Title</Label>
				<Input
					type="text"
					id="title"
					name="title"
					required
					defaultValue={visit.title}
					aria-invalid={Boolean(errors?.title)}
					aria-describedby={errors?.title ? "title-error" : undefined}
					placeholder="Enter your visit title ..."
				/>
				{errors?.title && (
					<p
						id="title-error"
						className="font-medium text-destructive text-sm"
						role="alert"
						aria-live="assertive"
					>
						{errors.title}
					</p>
				)}
			</div>
			<div className="space-y-2">
				<Label htmlFor="content">Content</Label>
				<Textarea
					id="content"
					name="content"
					required
					defaultValue={visit.content}
					aria-invalid={Boolean(errors?.content)}
					aria-describedby={errors?.content ? "content-error" : undefined}
					placeholder="Write your visits content here ..."
					rows={6}
				/>
				{errors?.content && (
					<p
						id="content-error"
						className="font-medium text-destructive text-sm"
						role="alert"
						aria-live="assertive"
					>
						{errors.content}
					</p>
				)}
			</div>
			{errors?.form && (
				<div
					className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 font-medium text-destructive text-sm"
					role="alert"
					aria-live="assertive"
				>
					{errors.form}
				</div>
			)}
			<Button
				type="submit"
				className="w-full cursor-pointer"
				disabled={isPending}
			>
				{isPending ? "Saving..." : "Save Changes"}
			</Button>
		</form>
	);
}
