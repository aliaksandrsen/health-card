"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createVisit, type State } from "../actions";

const initialState: State = { errors: {} };

export default function NewVisit() {
	const [state, formAction] = useFormState(createVisit, initialState);
	const { errors } = state;

	return (
		<div className="flex flex-1 flex-col items-center">
			<Card className="w-full max-w-3xl">
				<CardHeader>
					<CardTitle>Create New Visit</CardTitle>
				</CardHeader>
				<CardContent>
					<form action={formAction} className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="title">Title</Label>
							<Input
								type="text"
								id="title"
								name="title"
								required
								aria-invalid={Boolean(errors?.title)}
								aria-describedby={errors?.title ? "title-error" : undefined}
								placeholder="Enter your visit title ..."
							/>
							{errors?.title && (
								<p
									id="title-error"
									className="font-medium text-destructive text-sm"
									role="alert"
									aria-live="polite"
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
									aria-live="polite"
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
						<SubmitButton />
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<Button type="submit" className="w-full cursor-pointer" disabled={pending}>
			{pending ? "Creating..." : "Create Visit"}
		</Button>
	);
}
