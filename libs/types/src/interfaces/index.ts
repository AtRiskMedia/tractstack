import { ReactElement } from 'react';

type Scalars = {
  GatsbyImageData: any; // avoiding adding the gatsby-plugin-image dependency for now
  JSON: Record<string, unknown>;
};

export interface IStoryFragmentCompositorHooks {
  belief?: Function;
  youtube?: Function;
  toggle?: Function;
  processRead: Function;
  updateEventStream?: Function;
  resourcePayload?: any;
  templates?: any;
  setScrollToPane?: Function;
  Link?: Function;
}
export interface IPaneFragmentBackgroundColour {
  id: string;
  bgColour: string;
  hiddenViewports: string;
  internal: { [key: string]: string };
}
export interface IPaneFragmentBackgroundPane {
  id: string;
  zindex: number;
  shape: string;
  shapeDesktop?: string;
  shapeTablet?: string;
  shapeMobile?: string;
  hiddenViewports: string;
  optionsPayload: any; // FIX
  internal: { [key: string]: string };
}
export interface IPaneFragmentBackgroundVideo {
  id: string;
  zindex: number;
  altText: string;
  imageMaskShape: string;
  imageMaskShapeDesktop?: string;
  imageMaskShapeTablet?: string;
  imageMaskShapeMobile?: string;
  hiddenViewports: string;
  cdnUrl: string;
  optionsPayload: any; // FIX
  internal: { [key: string]: string };
}

export interface IPaneFragmentImageField {
  id: string;
  filename: string;
  childImageSharp: { gatsbyImageData: Scalars };
}

export interface IPaneFragmentImageFieldDict {
  [key: string]: IPaneFragmentImageField;
}
export interface IPaneFragmentBackgroundImage {
  id: string;
  zindex: number;
  altText: string;
  imageMaskShape: string;
  imageMaskShapeDesktop?: string;
  imageMaskShapeTablet?: string;
  imageMaskShapeMobile?: string;
  hiddenViewports: string;
  optionsPayload: any; // FIX
  bgPosition: string;
  internal: { [key: string]: string };
  relationships: {
    image: IPaneFragmentImageFieldDict[];
  };
}

export interface IPaneFragmentSvg {
  id: string;
  zindex: number;
  imageMaskShape: string;
  hiddenViewports: string;
  optionsPayload: any; // FIX
  svgTitle: { description: string };
  relationships: {
    svgFile: {
      id: string;
      filename: string;
      localFile: { publicURL: string };
    };
  };
  internal: { [key: string]: string };
}
export interface IPaneFragmentMarkdown {
  id: string;
  zindex: number;
  imageMaskShape: string;
  imageMaskShapeDesktop?: string;
  imageMaskShapeTablet?: string;
  imageMaskShapeMobile?: string;
  textShapeOutside: string;
  textShapeOutsideDesktop?: string;
  textShapeOutsideTablet?: string;
  textShapeOutsideMobile?: string;
  hiddenViewports: string;
  optionsPayload: any; // FIX
  isModal: boolean;
  isContextPane: boolean;
  childPaneFragment: { childMarkdownRemark: { htmlAst: { children: object } } };
  internal: { [key: string]: string };
  relationships: {
    image: {
      id: string;
      filename: string;
      mobile: { localFile: { childImageSharp: { gatsbyImageData: Scalars } } };
      tablet: { localFile: { childImageSharp: { gatsbyImageData: Scalars } } };
      desktop: { localFile: { childImageSharp: { gatsbyImageData: Scalars } } };
    };
    markdown: [any]; // fix
  };
  markdownId?: string;
  markdownBody?: string;
}
export type IPaneFragment =
  | IPaneFragmentBackgroundColour
  | IPaneFragmentBackgroundPane
  | IPaneFragmentBackgroundVideo
  | IPaneFragmentBackgroundImage
  | IPaneFragmentSvg
  | IPaneFragmentMarkdown;

export interface IPane {
  id: string;
  title: string;
  slug: string;
  optionsPayload: string;
  heightRatio: string;
  heightRatioDesktop?: string;
  heightRatioTablet?: string;
  heightRatioMobile?: string;
  heightOffset: number;
  heightOffsetDesktop?: number;
  heightOffsetTablet?: number;
  heightOffsetMobile?: number;
  relationships: {
    markdown?: any; // FIX
  };
  isContextPane?: boolean;
}

export interface IImpression {
  id: string;
  actionsLisp: string;
  body: string;
  buttonText: string;
  icon: string;
  parentId: string;
  title: string;
  weight: number;
}

export interface IImpressionDict {
  [key: string]: IImpression;
}

export interface IComposedStoryFragment {
  paneIds: string[];
  css: string;
  hasH5P: boolean;
  impressions: IImpressionDict;
}

export interface IComposedStoryFragmentDict {
  [key: string]: IComposedStoryFragment;
}

export interface ICodeHookIframe {
  target: string;
  url: string;
  height?: number;
  width?: number;
}
export interface ICodeHookShopify {
  id: string;
  target: string;
}
export interface ICodeHook {
  name: string;
  target: string;
}

export interface IContentMap {
  title: string;
  type: string;
  parentId: string;
  slug: string;
  heldBeliefs: any; // fix
  withheldBeliefs: any; // fix
  tailwindBgColour?: string;
  hasCodeHook?: ICodeHook | ICodeHookIframe | ICodeHookShopify;
  hasMaxHScreen?: boolean;
  hasOverflowHidden?: boolean;
  hasHiddenPane?: boolean;
}
export interface IContentMapDict {
  [key: string]: IContentMap;
}
export interface IContentChildrenDict {
  [key: string]: ReactElement;
}

export interface IRenderedStoryFragment {
  contentChildren: IContentChildrenDict;
  contentMap: IContentMapDict;
  id: string;
  slug: string;
  storyFragment: { [key: string]: IComposedStoryFragment | undefined };
  title: string;
  tractStackId: string;
  tractStackSlug: string;
  tractStackTitle: string;
}

export interface IStoryFragmentId {
  id: string;
  title: string;
  slug: string;
  tractStackId: string;
  tractStackTitle: string;
  tractStackSlug: string;
  home: string;
  isContextPane?: boolean;
  isBuilderPreview?: boolean;
  viewportKey?: string;
  paneId?: string;
  paneTitle?: string;
  paneSlug?: string;
}

export interface IContextPageProps {
  pageContext: any;
}

export interface IFooterProps {
  observe?: any;
}

export interface IPaneProps {
  thisId: string;
  children: any;
  inView?: any;
  observe?: any;
  hasMaxHScreen: boolean;
  hasOverflowHidden: boolean;
}

export interface ICodeHookProps {
  thisId: string;
  payload: ICodeHook;
  viewportKey: string;
  storyFragmentId: IStoryFragmentId;
}
export interface ICodeHookShopifyProps {
  thisId: string;
  payload: ICodeHookShopify;
}
export interface ICodeHookIframeProps {
  thisId: string;
  payload: ICodeHookIframe;
  viewportKey: string;
}

export interface IStoryFragmentRenderProps {
  viewportKey: string;
  payload: IRenderedStoryFragment;
  storyFragmentId: IStoryFragmentId;
}

export interface IRenderPaneProps {
  viewportKey: string;
  payload: {
    panePayload: IContentMap;
    children: ReactElement;
  };
  paneId: string;
  storyFragmentId: IStoryFragmentId;
}

export interface ICodeHookDict {
  [key: string]: any;
}

export interface ITemplateDict {
  [key: string]: any;
}

export interface IMenuPayload {
  optionsPayload: string;
  theme: string;
  id: string;
  internal: { type: string };
}

export interface IMenuProps {
  menuPayload: IMenuPayload;
  viewportKey: string;
}

export interface IContextPanesPayload {
  slug: string;
  id: string;
  relationships: { paneFragments: any[] };
  title: string;
}

export interface IStoryFragmentCompositorPayload {
  slug: string;
  socialImagePath: string | null;
  tailwindBgColour: string | null;
  id: string;
  title: string;
  relationships: {
    contextPanes: IContextPanesPayload;
    panes: IPane[];
    tractstack: {
      slug: string;
      socialImagePath: string | null;
      id: string;
      relationships: {
        contextPanes: IContextPanesPayload;
        storyFragments: { id: string; title: string; slug: string };
      };
      title: string;
    };
  };
}
export interface IStoryFragmentCompositorProps {
  data: IStoryFragmentCompositorPayload;
  viewportKey: string;
  hooks: IStoryFragmentCompositorHooks;
}

export interface IStoryFragmentProps {
  payload: IRenderedStoryFragment;
  contextPanesMap: any; // FIX
}

export interface IWrapperProps {
  children: any; // FIX
  slug: string;
  mode: string;
}

export interface IViewportKeyProps {
  viewportKey: string;
  beliefHook: Function;
  storyFragmentId: IStoryFragmentId;
}

export interface INavLinkProps {
  children: any; // FIX
  to: string;
}

export interface IHeaderProps {
  siteTitle: string;
  open: boolean;
  menu?: IMenuPayload;
  isHome?: boolean;
}

export interface IH5PProps {
  src: string;
  title: string;
  parent: string;
}

export interface ID3Props {
  options: any;
  slug: string;
}

export interface IImpressionProps {
  payload: {
    id: string;
    actionsLisp: string;
    body: string;
    buttonText: string;
    icon: string;
    parentId: string;
    title: string;
    weight: number;
  };
}

export interface IControllerProps {
  impressions: IImpressionDict | null;
  impressionPanes: string[];
  viewportKey: string;
  contentMap: IContentMapDict;
}

export interface ICompositorProps {
  panesPayload: IPane[];
  tailwindBgColour: string | null;
  viewportKey: string;
  hooks: IStoryFragmentCompositorHooks;
  id: IStoryFragmentId;
}
