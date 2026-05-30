import { useState } from "react";
import LocationPicker from "../components/LocationPicker";
import CreatePostForm from "../components/CreatePostForm";

export default function CreatePostPage() {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <main className="h-screen overflow-hidden bg-[#050505] text-[#e5e7eb]">
      <div className="relative flex h-full flex-col md:flex-row">
        <LocationPicker showOverlay={showOverlay} onPinClick={() => setShowOverlay(true)} />
        <section className="h-[58vh] w-full overflow-y-auto bg-[#0f1115] px-5 py-5 md:h-full md:w-[40%] md:px-10 md:py-6">
          <CreatePostForm />
        </section>
      </div>
    </main>
  );
}