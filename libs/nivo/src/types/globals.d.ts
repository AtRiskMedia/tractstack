import JSX from 'react';

declare module 'tractstack-nivo' {
  const DetailsPie: JSX.Component;
  const PaneActivitySwarm: JSX.Component;
  const StoryFragmentActivitySwarm: JSX.Component;
  const RecentDailyActivity: JSX.Component;
  export { DetailsPie, PaneActivitySwarm, StoryFragmentActivitySwarm, RecentDailyActivity };
}
