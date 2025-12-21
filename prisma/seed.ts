import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error("DATABASE_URL is not set");
}

const prisma = new PrismaClient({
	adapter: new PrismaPg({ connectionString }),
});

async function main() {
	const alex = await prisma.user.create({
		data: {
			email: "test@test.com",
			name: "User Dev",
			password: await hash("1234", 10),
		},
	});

	await prisma.visit.createMany({
		data: [
			{
				title: "Annual Physical with Dr. Carter",
				content:
					"Discussed overall wellness, reviewed lab work, and received recommendations for maintaining heart health.",
				userId: alex.id,
			},
			{
				title: "Dermatology Consultation for Persistent Rash",
				content:
					"Evaluated chronic rash on forearms, started topical steroid, and scheduled a two-week follow-up.",
				userId: alex.id,
			},
			{
				title: "Cardiology Follow-Up on Blood Pressure Medication",
				content:
					"Reviewed home blood pressure logs, adjusted dosage of lisinopril, and ordered repeat labs.",
				userId: alex.id,
			},
			{
				title: "Allergy Testing Appointment at Downtown Clinic",
				content:
					"Completed skin prick tests for seasonal allergens and received guidance on avoidance strategies.",
				userId: alex.id,
			},
			{
				title: "Orthopedic Evaluation After Knee Pain",
				content:
					"Assessed right knee discomfort following a run, ordered MRI imaging, and recommended rest with ice therapy.",
				userId: alex.id,
			},
			{
				title: "ENT Visit for Chronic Sinus Congestion",
				content:
					"Discussed six-month history of congestion, started nasal spray, and planned a CT scan if symptoms persist.",
				userId: alex.id,
			},
			{
				title: "Nutrition Counseling for Weight Management",
				content:
					"Reviewed food diary, set calorie goals, and outlined a protein-forward meal plan for the month.",
				userId: alex.id,
			},
			{
				title: "Immunization Appointment for Seasonal Flu Shot",
				content:
					"Received annual influenza vaccine, confirmed no adverse reactions, and updated immunization record.",
				userId: alex.id,
			},
			{
				title: "Neurology Assessment for Migraine Episodes",
				content:
					"Reviewed migraine triggers, prescribed preventive therapy, and scheduled a three-month check-in.",
				userId: alex.id,
			},
			{
				title: "Endocrinology Review of Thyroid Function",
				content:
					"Discussed lab trends showing mild hypothyroidism and initiated levothyroxine with monitoring plan.",
				userId: alex.id,
			},
			{
				title: "Physical Therapy Session for Shoulder Rehab",
				content:
					"Practiced range-of-motion exercises for rotator cuff strain and received an updated home routine.",
				userId: alex.id,
			},
			{
				title: "Urgent Care Visit for Acute Stomach Pain",
				content:
					"Evaluated abdominal cramps, administered IV fluids, and recommended bland diet with follow-up if pain returns.",
				userId: alex.id,
			},
			{
				title: "Virtual Consultation About Sleep Difficulties",
				content:
					"Reviewed sleep hygiene habits, ordered home sleep apnea test, and provided melatonin dosing guidance.",
				userId: alex.id,
			},
			{
				title: "Ophthalmology Check for Sudden Blurry Vision",
				content:
					"Completed dilated exam, ruled out retinal tear, and prescribed updated corrective lenses.",
				userId: alex.id,
			},
			{
				title: "Lab Results Review on Cholesterol Management",
				content:
					"Discussed improved lipid panel, continued statin therapy, and encouraged consistent aerobic exercise.",
				userId: alex.id,
			},
			{
				title: "Prenatal Style Nutrition Check-In for Partner Support",
				content:
					"Met with obstetric dietitian to understand nutrition needs, documented meal prep ideas, and planned next visit.",
				userId: alex.id,
			},
			{
				title: "Post-Operative Follow-Up After Appendectomy",
				content:
					"Inspected incision healing, cleared light exercise, and emphasized warning signs that require urgent care.",
				userId: alex.id,
			},
			{
				title: "Mental Health Counseling for Anxiety Management",
				content:
					"Discussed coping strategies, documented progress with mindfulness practices, and set weekly therapy goals.",
				userId: alex.id,
			},
			{
				title: "Travel Clinic Visit for Vaccine Guidance",
				content:
					"Reviewed upcoming trip itinerary, received hepatitis A booster, and obtained malaria prophylaxis instructions.",
				userId: alex.id,
			},
			{
				title: "Sports Medicine Evaluation for Marathon Training",
				content:
					"Completed gait analysis, adjusted training plan to prevent overuse injuries, and scheduled follow-up in six weeks.",
				userId: alex.id,
			},
			{
				title: "Primary Care Visit to Review Vaccination History",
				content:
					"Audited immunization record, ordered tetanus booster, and updated digital health profile for employer.",
				userId: alex.id,
			},
		],
	});

	console.log("Seeding completed.");
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
