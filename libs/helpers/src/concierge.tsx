import {
  IStoryFragmentCompositorHooks,
  IStoryFragmentId,
} from '@tractstack/types';

export const preParseConcierge = (
  payload: any,
  id: IStoryFragmentId,
  hooks: IStoryFragmentCompositorHooks
) => {
  const thisPayload = (payload && payload[0]) || false;
  const command = (thisPayload && thisPayload[0] && thisPayload[0][0]) || null;
  const parameters =
    (thisPayload && thisPayload[0] && thisPayload[0][1]) || null;
  const parameterOne = (parameters && parameters[0]) || null;
  const parameterTwo = (parameters && parameters[1]) || null;

  switch (command) {
    case `goto`:
      switch (parameterOne) {
        case `home`:
          return `/`;
        case `concierge`:
          return `/concierge/${parameterTwo}`;
        case `context`:
          return `/context/${parameterTwo}`;
          break;
        case `product`:
          return `/products/${parameterTwo}`;
        case `storyFragment`:
          if (parameterTwo !== id.home) return `/${parameterTwo}`;
          return `/`;
        case `url`:
          return [parameterTwo];
        default:
          console.log(`LispActionPayload preParse misfire on goto`, parameters);
      }
      break;
    default:
      console.log(`LispActionPayload preParse misfire`, command, parameters);
      break;
  }
};

export const concierge = (
  payload: any,
  hooks: IStoryFragmentCompositorHooks,
  id?: IStoryFragmentId,
  parent?: string
) => {
  const processRead = hooks.processRead;
  const updateEventStream = hooks.updateEventStream;
  const thisPayload = (payload && payload[0]) || false;
  const command = (thisPayload && thisPayload[0] && thisPayload[0][0]) || null;
  const parameters =
    (thisPayload && thisPayload[0] && thisPayload[0][1]) || null;
  const parameterOne = (parameters && parameters[0]) || null;
  const parameterTwo = (parameters && parameters[1]) || null;

  if (id && id?.paneId && id?.paneTitle && updateEventStream)
    updateEventStream(Date.now(), {
      id: id.paneId,
      title: id.paneTitle,
      type: `Pane`,
      verb: `CLICKED`,
      parentId: id.id,
    });
  if (
    updateEventStream &&
    parameterOne &&
    parameterTwo &&
    id &&
    id?.paneId &&
    id?.paneTitle &&
    [`home`, `storyFragment`, `context`].includes(parameterOne)
  ) {
    updateEventStream(Date.now(), {
      id: id.paneId,
      title: id.paneTitle,
      targetSlug: command === `home` ? `home` : parameterTwo,
      type: `Pane`,
      verb: `CONNECTED`,
    });
  }

  switch (command) {
    case `goto`:
      switch (parameterOne) {
        case `home`:
          processRead(`/`, parameterOne, id?.id);
          break;
        case `concierge`:
          processRead(`/concierge/${parameterTwo}`, parameterOne, id?.id);
          break;
        case `context`:
          processRead(`/context/${parameterTwo}`, parameterOne, parent);
          break;
        case `product`:
          processRead(`/products/${parameterTwo}`, parameterOne, id?.id);
          break;
        case `storyFragment`:
          processRead(parameterTwo, parameterOne, id?.id);
          break;
        case `anchor`:
          processRead(`#`, parameterTwo, id?.id);
          break;
        case `url`:
          window.location.replace(parameterTwo);
          break;
        default:
          console.log(`LispActionPayload misfire on goto`, parameters);
      }
      break;
    default:
      console.log(`LispActionPayload misfire`, command, parameters);
      break;
  }
};
