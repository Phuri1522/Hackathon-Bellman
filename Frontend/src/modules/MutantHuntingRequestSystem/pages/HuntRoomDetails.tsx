import HuntMap from "../components/HuntMap";
import HuntInfo from "../components/HuntInfo";
import AssignedHunterCard from "../components/AssignedHunterCard";
import ApplicantCard from "../components/ApplicantCard";

export default function HuntRoomDetails() {
    return (
        <main className="flex h-screen flex-col md:flex-row bg-[#050505] text-[#e5e7eb]">
            <HuntMap />

            <section className="w-full md:w-[42%] overflow-y-auto bg-[#0f1115] p-4 md:p-6">
                <HuntInfo />

                <AssignedHunterCard />

                <p className="mb-3 font-mono text-xs uppercase tracking-wider text-[#9ca3af]">
                    Applicants
                </p>

                <ApplicantCard name="HUNTER_01" rank="B" status="accepted" />
                <ApplicantCard name="HUNTER_07" rank="C" status="pending" />
                <ApplicantCard name="HUNTER_13" rank="D" status="declined" />
            </section>
        </main>
    );
}