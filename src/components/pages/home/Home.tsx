import Analytics from './Analytics';
import Recents from './Recents';
import { messages } from '@/constants/messages';

export default function Home() {
  return (
    <div className="flex flex-col gap-4 w-full h-fit">
      <h1 className="text-4xl font-bold">{messages.labels.recent}</h1>
      <Recents />
      <Analytics />
    </div>
  );
}
