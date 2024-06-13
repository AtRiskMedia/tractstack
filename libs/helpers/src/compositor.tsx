// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react';

import {
  Svg,
  SvgShapeOutsidePayload,
  SvgImageMaskPayload,
  HtmlAstToReact,
  viewportWidth,
  classNames,
} from './helper';
import {
  IComposedStoryFragment,
  IPane,
  IPaneFragment,
  IStoryFragmentId,
  ICompositorProps,
  IStoryFragmentCompositorHooks,
  IContentMapDict,
  IImpressionDict,
  IContentChildrenDict,
  IPaneFragmentMarkdown,
  IPaneFragmentBackgroundPane,
  IPaneFragmentBackgroundColour,
  // IPaneFragmentBackgroundImage,
  // IPaneFragmentBackgroundVideo,
  // IPaneFragmentSvg,
} from './types';

export const Compositor = ({
  panesPayload,
  tailwindBgColour,
  viewportKey,
  hooks,
  id,
}: ICompositorProps) => {
  let thisCss = ``;
  let hasH5P = false;
  const contentMap: IContentMapDict = {};
  const contentChildren: IContentChildrenDict = {};
  const impressions: IImpressionDict = {};
  const paneIds: string[] = [];
  let hasMaxHScreen, heldBeliefs, withheldBeliefs;
  const isContextPane = id?.isContextPane;
  const keys = isContextPane ? [`all`] : [`mobile`, `tablet`, `desktop`];
  const check = `^bg-(w*-w*|w*)`;
  const useTailwindBgColour: string | null =
    tailwindBgColour && tailwindBgColour.match(check) ? tailwindBgColour : ``;
  panesPayload?.forEach((p: IPane) => {
    paneIds.push(p.id);
    keys.forEach((key) => {
      let hasCodeHook: any = {};
      let hasHiddenPane = false;
      let hasOverflowHidden = false;
      const paneHeightRatio = p.heightRatio
        ? p.heightRatio
        : viewportKey === `desktop` && p.heightRatioDesktop
        ? p.heightRatioDesktop
        : viewportKey === `tablet` && p.heightRatioTablet
        ? p.heightRatioTablet
        : viewportKey === `mobile` && p.heightRatioMobile
        ? p.heightRatioMobile
        : `0`;
      const height = (viewportWidth[key] * Number(paneHeightRatio)) / 100;
      const thisPanePayload = PaneCompositor(p, key, hooks, id);
      if (thisPanePayload?.hasH5P) hasH5P = true;
      if (thisPanePayload?.hasHiddenPane) hasHiddenPane = true;
      if (thisPanePayload?.hasCodeHook)
        hasCodeHook = thisPanePayload.hasCodeHook;
      if (thisPanePayload?.heldBeliefs)
        heldBeliefs = thisPanePayload.heldBeliefs;
      else heldBeliefs = null;
      if (thisPanePayload?.withheldBeliefs)
        withheldBeliefs = thisPanePayload.withheldBeliefs;
      else withheldBeliefs = null;
      if (thisPanePayload?.hasMaxHScreen) hasMaxHScreen = true;
      else hasMaxHScreen = false;
      if (thisPanePayload?.hasOverflowHidden) hasOverflowHidden = true;
      if (typeof thisPanePayload?.impressions?.payload === `object`)
        impressions[p.id] = {
          ...thisPanePayload.impressions.payload,
          id: p.id,
        };
      if (typeof thisPanePayload?.css === `string`)
        thisCss = `${thisCss} ${thisPanePayload.css} `;
      if (height === 0)
        thisCss = `#${key}-${p.id} { height: auto; } ${thisCss} `;
      else if (height > 0)
        thisCss =
          `#${key}-${p.id} { height: calc(var(--scale) * ${height} * 1px); } ` +
          `${thisCss} `;
      const thisChildren = thisPanePayload.children.filter((e: any) => {
        return Object.keys(e).length;
      });
      if (
        id?.isBuilderPreview &&
        thisChildren.length === 0 &&
        Object.keys(hasCodeHook).length > 0
      )
        contentChildren[`${key}-${p.id}`] = (
          <div className="py-16 flex items-center justify-center">
            <p>[Code hook inserted here]</p>
          </div>
        );
      else if (id?.isBuilderPreview && thisChildren.length === 0)
        contentChildren[`${key}-${p.id}`] = (
          <div className="py-16 flex items-center justify-center">
            <p>[Empty pane]</p>
          </div>
        );
      else contentChildren[`${key}-${p.id}`] = thisChildren;
      contentMap[p.id] = {
        title: p.title,
        slug: p.slug,
        type: !id?.id && id.tractStackId ? `Context` : `Pane`,
        parentId: id?.id ? id.id : id.tractStackId,
        hasMaxHScreen,
        hasOverflowHidden,
        hasHiddenPane,
        hasCodeHook,
        heldBeliefs,
        withheldBeliefs,
      };
    });
  });
  if (id?.tractStackId)
    contentMap[id.tractStackId] = {
      title: id.tractStackTitle,
      slug: id.tractStackSlug,
      type: `TractStack`,
      parentId: id.tractStackId,
      heldBeliefs: null,
      withheldBeliefs: null,
    };
  if (id?.id && id?.title && id?.slug) {
    contentMap[id.id] = {
      title: id.title,
      slug: id.slug,
      type: `StoryFragment`,
      parentId: id.tractStackId,
      tailwindBgColour: useTailwindBgColour,
      heldBeliefs: null,
      withheldBeliefs: null,
    };
    const storyFragment: IComposedStoryFragment = {
      paneIds,
      css: thisCss,
      hasH5P,
      impressions,
    };
    return {
      storyFragment,
      contentMap,
      contentChildren,
    };
  }
  return {
    contentMap,
    contentChildren,
  };
};

const PaneCompositor = (
  payload: IPane,
  viewportKey: string,
  hooks: IStoryFragmentCompositorHooks,
  id: IStoryFragmentId
) => {
  const optionsPayload = payload?.optionsPayload
    ? ParseOptions(payload.optionsPayload)
    : null;
  const hasCodeHook = optionsPayload?.codeHook;
  const hasHiddenPane = optionsPayload?.hiddenPane;
  const hasH5P = hasCodeHook && hasCodeHook.target === `h5p`;
  const impressionsPayload =
    id?.id &&
    optionsPayload?.impressions &&
    ParseImpressions(optionsPayload.impressions, id.id);
  const maxHeightScreen = !!(
    optionsPayload &&
    optionsPayload[`max-h-screen`] &&
    optionsPayload[`max-h-screen`] === true
  );
  const hasOverflowHidden = !!(
    optionsPayload &&
    optionsPayload.overflowHidden &&
    optionsPayload.overflowHidden === true
  );
  const heldBeliefs = optionsPayload?.heldBeliefs;
  const withheldBeliefs = optionsPayload?.withheldBeliefs;
  const paneHeightRatio = payload.heightRatio
    ? payload.heightRatio
    : viewportKey === `desktop` && payload.heightRatioDesktop
    ? payload.heightRatioDesktop
    : viewportKey === `tablet` && payload.heightRatioTablet
    ? payload.heightRatioTablet
    : viewportKey === `mobile` && payload.heightRatioMobile
    ? payload.heightRatioMobile
    : `0`;
  const paneHeight =
    (viewportWidth[viewportKey] * Number(paneHeightRatio)) / 100;
  const paneHeightOffsetViewport =
    viewportKey === `desktop`
      ? payload.heightOffsetDesktop
      : viewportKey === `tablet`
      ? payload.heightOffsetTablet
      : viewportKey === `mobile`
      ? payload.heightOffsetMobile
      : null;
  const cssContainer =
    typeof paneHeightOffsetViewport === `number` && paneHeightOffsetViewport
      ? `#wrapper-${viewportKey}-${
          payload.id
        } { margin-top: calc(var(--scale) * ${paneHeightOffsetViewport.toString()} * 1px ); } `
      : ``;
  const compositing =
    typeof optionsPayload?.paneFragmentsPayload === `object` &&
    optionsPayload?.paneFragmentsPayload.length > 0
      ? optionsPayload.paneFragmentsPayload
          .filter(
            (e: IPaneFragment) =>
              typeof e?.hiddenViewports === `string` &&
              !e.hiddenViewports.includes(viewportKey)
          )
          .sort(
            (a: any, b: any) => (a?.field_zindex || 0) - (b?.field_zindex || 0)
          )
          .map((f: any) => {
            switch (f?.internal?.type) {
              case `markdown`:
                return ParagraphMarkdownCompositor(
                  {
                    ...f,
                    relationships: {
                      markdown: payload.relationships.markdown,
                      ...f.relationships,
                    },
                  },
                  viewportKey,
                  paneHeight,
                  hooks,
                  payload.id,
                  {
                    ...id,
                    paneId: payload.id,
                    paneTitle: payload.title,
                    paneSlug: payload.slug,
                  }
                );
              case `bgPane`:
                return ParagraphBackgroundPaneCompositor(f, viewportKey);
              // case `paragraph__background_image`:
              //  return ParagraphBackgroundImageCompositor(f, viewportKey, hooks)
              // case `paragraph__background_video`:
              //  return ParagraphBackgroundVideoCompositor(f, viewportKey)
              // case `paragraph__svg`:
              //  return ParagraphSvgCompositor(f, viewportKey)
              case `bgColour`:
                return ParagraphBackgroundColourCompositor(
                  f,
                  viewportKey,
                  payload.id
                );
              default:
                console.log(`No compositor for ${f?.internal?.type}`);
                return null;
            }
          })
      : {};
  const thisChildren =
    compositing && Object.keys(compositing).length > 0
      ? compositing
          .map((e: any) => {
            return e?.children || null;
          })
          .filter((n: any) => n)
      : [];
  const thisCss =
    compositing && Object.keys(compositing).length > 0
      ? compositing
          .map((e: any) => {
            return e?.css || null;
          })
          .filter((n: any) => n)
      : [];
  const thisCssJoined = thisCss.join(` `);
  return {
    slug: payload.slug,
    children: thisChildren || [],
    css: `${thisCssJoined} ${cssContainer}`.replace(/\s\s+/g, ``),
    impressions: impressionsPayload,
    hasH5P,
    hasHiddenPane,
    hasCodeHook,
    hasMaxHScreen: maxHeightScreen,
    hasOverflowHidden,
    heldBeliefs,
    withheldBeliefs,
  };
};

const ParagraphMarkdownCompositor = (
  payload: IPaneFragmentMarkdown,
  viewportKey: string,
  paneHeight: number,
  hooks: IStoryFragmentCompositorHooks,
  parent: string,
  id: IStoryFragmentId
) => {
  const optionsPayload = payload.optionsPayload;
  const hasModal = payload?.isModal;
  const thisId = `${viewportKey}-${payload.id}-markdown`;
  const thisIdModal = `${viewportKey}-${payload.id}-modal`;
  const zIndex = ``; // `z-index: ${payload?.zindex || `100`};`
  const zIndexModal = ``; //hasModal
  //  ? `z-index: ${(payload.zindex - 1).toString() || `99`};`
  //  : false
  const thisTextShapeOutsideSelector =
    viewportKey === `desktop`
      ? payload.textShapeOutsideDesktop
      : viewportKey === `tablet`
      ? payload.textShapeOutsideTablet
      : viewportKey === `mobile`
      ? payload.textShapeOutsideMobile
      : payload.textShapeOutside;
  const thisImageMaskShapeSelector =
    viewportKey === `desktop`
      ? payload.imageMaskShapeDesktop
      : viewportKey === `tablet`
      ? payload.imageMaskShapeTablet
      : viewportKey === `mobile`
      ? payload.imageMaskShapeMobile
      : payload.imageMaskShape;
  const hasModalShapeOutside =
    hasModal && thisTextShapeOutsideSelector !== `none`
      ? thisTextShapeOutsideSelector
      : false;
  const isModal =
    typeof optionsPayload.modal !== `undefined` &&
    typeof optionsPayload.modal[viewportKey] !== `undefined`;
  const thisModalPayload = isModal ? optionsPayload.modal[viewportKey] : null;
  const hasModalShapeOutsidePayload =
    isModal && hasModalShapeOutside
      ? SvgShapeOutsidePayload(
          hasModalShapeOutside,
          viewportKey,
          thisIdModal,
          paneHeight,
          isModal,
          thisModalPayload
        )
      : false;
  const hasTextShapeOutsidePayload =
    thisTextShapeOutsideSelector &&
    typeof thisTextShapeOutsideSelector === `string`
      ? SvgShapeOutsidePayload(
          thisTextShapeOutsideSelector,
          viewportKey,
          thisId,
          paneHeight,
          isModal,
          thisModalPayload
        )
      : false;
  const hasMaskPayload =
    thisImageMaskShapeSelector && thisImageMaskShapeSelector.length
      ? SvgImageMaskPayload(thisImageMaskShapeSelector, thisId, viewportKey)
      : false;
  const hasModalMaskPayload =
    isModal && thisImageMaskShapeSelector && thisImageMaskShapeSelector?.length
      ? SvgImageMaskPayload(
          thisImageMaskShapeSelector,
          thisIdModal,
          viewportKey
        )
      : false;
  const cssModalMask = hasModalMaskPayload || ``;
  const imageDataArrayNew = payload?.relationships?.markdown?.map((e: any) => {
    return e?.relationships?.images?.concat(e?.relationships?.imagesSvg);
  })[0];
  const imageDataArray =
    typeof imageDataArrayNew === `object` &&
    Object.keys(imageDataArrayNew).length > 0
      ? imageDataArrayNew
      : payload?.relationships?.image;
  const htmlAst =
    payload?.markdownId &&
    payload?.relationships?.markdown.filter(
      (e: any) => e.id === payload?.markdownId
    ).length
      ? payload?.relationships?.markdown.filter(
          (e: any) => e.id === payload?.markdownId
        )[0].childMarkdown?.childMarkdownRemark
      : payload?.childPaneFragment?.childMarkdownRemark;
  const astPayload = htmlAst && {
    ast: htmlAst?.htmlAst?.children,
    mode: `paragraph__markdown`,
    buttonData: optionsPayload?.buttons,
    imageData: imageDataArray,
    parent,
    viewportKey,
  };
  const hasClassNames = optionsPayload?.classNames;
  const hasClassNamesAll = optionsPayload?.classNames?.all;
  const hasClassNamesViewport =
    hasClassNames &&
    typeof optionsPayload.classNames[viewportKey] !== `undefined`;
  const injectClassNames = hasClassNamesAll
    ? optionsPayload.classNames.all
    : hasClassNamesViewport
    ? optionsPayload.classNames[viewportKey]
    : ``;
  const hasClassNamesParent = optionsPayload?.classNamesParent;
  const hasClassNamesParentAll =
    hasClassNamesParent && optionsPayload.classNamesParent.all;
  const hasClassNamesParentViewport =
    hasClassNamesParent &&
    typeof optionsPayload?.classNamesParent[viewportKey] !== `undefined`;
  const classNamesParent = hasClassNamesParentAll
    ? optionsPayload.classNamesParent.all
    : hasClassNamesParentViewport
    ? optionsPayload.classNamesParent[viewportKey]
    : ``;
  const hasClassNamesModal = optionsPayload?.classNamesModal;
  const hasClassNamesModalAll =
    hasClassNamesModal && optionsPayload.classNamesModal.all;
  const hasClassNamesModalViewport =
    hasClassNamesModal &&
    typeof optionsPayload?.classNamesModal[viewportKey] !== `undefined`;
  const classNamesModal = hasClassNamesModalAll
    ? optionsPayload.classNamesModal.all
    : hasClassNamesModalViewport
    ? optionsPayload.classNamesModal[viewportKey]
    : ``;
  const markdownArray = astPayload ? (
    HtmlAstToReact(
      astPayload,
      false,
      injectClassNames,
      hooks,
      {},
      { ...id, viewportKey }
    )
  ) : (
    <></>
  );
  const cssMask = hasMaskPayload || ``;
  const cssTextShapeOutside = hasTextShapeOutsidePayload
    ? hasTextShapeOutsidePayload.css
    : ``;
  const cssShapeOutsideModal = hasModalShapeOutsidePayload
    ? hasModalShapeOutsidePayload.css
    : ``;
  const css = `#${thisId} { ${zIndex} ${cssMask} } ${cssTextShapeOutside} `;
  const cssModal = hasModal
    ? `#${thisIdModal} { ${zIndexModal} ${cssModalMask} } ${cssShapeOutsideModal} `
    : ``;
  let working: any;
  if (!classNamesParent) working = markdownArray;
  else if (typeof classNamesParent === `string`)
    working = <div className={classNamesParent}>{markdownArray}</div>;
  else
    classNamesParent.reverse().forEach((e: any) => {
      if (typeof working === `undefined`)
        working = <div className={e}>{markdownArray}</div>;
      else working = <div className={e}>{working}</div>;
    });
  const thisMarkdown = working;
  const jsxMarkdown = hasTextShapeOutsidePayload ? (
    <div
      id={thisId}
      key={thisId}
      className={`paneFragment paneFragment-${viewportKey} paneFragmentParagraphOutside`}
    >
      {hasTextShapeOutsidePayload.left}
      {hasTextShapeOutsidePayload.right}
      {thisMarkdown}
    </div>
  ) : (
    <div
      id={thisId}
      key={thisId}
      className="paneFragment paneFragmentParagraph"
    >
      {thisMarkdown}
    </div>
  );
  const jsxModal =
    hasModalShapeOutsidePayload &&
    typeof hasModalShapeOutsidePayload === `object` ? (
      <div
        id={`${thisIdModal}`}
        key={`${thisIdModal}`}
        className={classNames(
          `paneFragment paneFragmentModal`,
          classNamesModal
        )}
      >
        {hasModalShapeOutsidePayload?.shape}
      </div>
    ) : null;
  const thisJsx = !isModal ? [jsxMarkdown] : [jsxModal, jsxMarkdown];
  return {
    children: thisJsx,
    css: `${css} ${cssModal}`,
  };
};

const ParagraphBackgroundPaneCompositor = (
  payload: IPaneFragmentBackgroundPane,
  viewportKey: string
) => {
  const zIndex = ``; // `z-index: ${payload?.zindex || `100`};`
  const optionsPayload = payload.optionsPayload;
  const hasArtpack = optionsPayload?.artpack;
  const hasArtpackAll = hasArtpack?.all;
  const hasArtpackViewport =
    hasArtpack &&
    typeof hasArtpack[viewportKey] !== `undefined` &&
    hasArtpack[viewportKey];
  const artpack = (hasArtpack && hasArtpackAll) || hasArtpackViewport;
  const artpackMode = artpack?.mode;
  const artpackFiletype = artpack?.filetype;
  const artpackCollection = artpack?.collection;
  const viewportPrefix =
    viewportKey === `desktop` || viewportKey === `tablet` ? `1920` : `800`;
  const filenamePrefix =
    artpackCollection !== `custom` ? `${artpackCollection}-` : ``;
  const artpackImage = artpack?.image;
  const thisId = `${viewportKey}-${payload.id}-pane`;
  const thisShapeSelector =
    viewportKey === `desktop`
      ? payload.shapeDesktop
      : viewportKey === `tablet`
      ? payload.shapeTablet
      : viewportKey === `mobile`
      ? payload.shapeMobile
      : payload.shape;
  const shapeName = thisShapeSelector !== `none` ? thisShapeSelector : null;
  const shape =
    typeof shapeName === `string` ? Svg(shapeName, viewportKey, thisId) : <></>;
  const hasClassNamesParent = optionsPayload?.classNamesParent;
  const hasClassNamesParentAll =
    hasClassNamesParent && optionsPayload.classNamesParent.all;
  const hasClassNamesParentViewport =
    hasClassNamesParent &&
    typeof optionsPayload?.classNamesParent[viewportKey] !== `undefined`;
  const classNamesParent = hasClassNamesParentAll
    ? optionsPayload.classNamesParent.all
    : hasClassNamesParentViewport
    ? optionsPayload.classNamesParent[viewportKey]
    : ``;

  // modes -- standard = as-is
  // break = use artpack, show svg (from shapes), no mask
  // mask = use artpack, show image via css url, apply mask via css

  const breakSvg =
    artpackMode === `break` &&
    typeof artpackImage === `string` &&
    typeof artpackCollection === `string`
      ? Svg(`${artpackCollection}${artpackImage}`, thisId, viewportKey)
      : false;
  const breakSvgFill =
    breakSvg && typeof artpack?.svgFill === `string` ? artpack.svgFill : `none`;
  const maskSvg =
    artpackMode === `mask` && shapeName
      ? SvgImageMaskPayload(shapeName, thisId, viewportKey)
      : false;
  // @ts-ignore
  const maskObjectFit =
    maskSvg && typeof artpack?.objectFit === `string`
      ? artpack.objectFit
      : `cover`;
  const thisShape = breakSvg || (maskSvg ? <></> : shape);
  const breakCss = breakSvg ? `#${thisId} svg { fill: ${breakSvgFill}; }` : ``;
  const url = `/${artpackCollection}-artpack/${viewportPrefix}/${filenamePrefix}${artpackImage}.${artpackFiletype}`;
  const maskCss =
    maskSvg &&
    artpackCollection &&
    artpackImage &&
    artpackFiletype &&
    maskObjectFit
      ? `#${thisId} { background:url('${url}'); background-size:${maskObjectFit}; ${zIndex} ${maskSvg} }`
      : ``;
  const css = `#${thisId} { ${zIndex} } ${breakCss} ${maskCss}`;
  const thisJsx = [
    <div
      id={thisId}
      key={thisId}
      className={classNames(`paneFragment paneFragmentShape`, classNamesParent)}
    >
      {thisShape}
    </div>,
  ];

  return {
    children: thisJsx,
    css,
  };
};

/*
const ParagraphBackgroundImageCompositor = (
  payload: IPaneFragmentBackgroundImage,
  viewportKey: string,
  hooks: IStoryFragmentHooks,
) => {
  const thisId = `${viewportKey}-${payload.id}-image`
  const getImage = hooks.getImage
  const GatsbyImage: any = hooks.GatsbyImage
  const zIndex = `` // `z-index: ${payload?.zindex || `100`};`
  const altText =
    payload?.altText ||
    `We care about A11y and apologize for this missing image description. This should not happen.`
  const backgroundPosition = payload?.bgPosition || `center`
  const optionsPayload = payload.optionsPayload
  const parallaxSpeed = optionsPayload?.parallaxSpeed || false
  const maxHeightScreen =
    optionsPayload &&
    optionsPayload[`max-h-screen`] &&
    optionsPayload[`max-h-screen`] === true
      ? `max-height: 100vh; `
      : ``
  const maxHeightScreenMore =
    maxHeightScreen !== ``
      ? `#${thisId} section { max-height:100vh; } ` +
        `#${thisId} .gatsby-image-wrapper { max-height:100vh; } `
      : ``
  const thisMaskShape =
    viewportKey === `desktop`
      ? payload.imageMaskShapeDesktop
      : viewportKey === `tablet`
      ? payload.imageMaskShapeTablet
      : viewportKey === `mobile`
      ? payload.imageMaskShapeMobile
      : payload.imageMaskShape
  const hasMaskShape = thisMaskShape !== `none` ? thisMaskShape : false
  const hasMaskPayload =
    hasMaskShape && hasMaskShape.length
      ? SvgImageMaskPayload(hasMaskShape, thisId, viewportKey)
      : false
  const cssMask = hasMaskPayload || ``
  const objectFit = optionsPayload?.objectFit || `cover`
  const imageData = payload?.relationships?.image[0] // only takes first image
  const imageDataThisViewport =
    imageData[viewportKey].childImageSharp.gatsbyImageData
  const image = imageDataThisViewport && getImage(imageDataThisViewport)

  const css =
    `#${thisId} { ${maxHeightScreen} ${zIndex} ${cssMask} } ${maxHeightScreenMore} ` +
    `#${thisId} .gatsby-image-wrapper { height:100%; } `
  const thisJsx = image ? (
    <div
      id={thisId}
      key={thisId}
      className="paneFragment paneFragmentImage grid place-items-center"
    >
      <GatsbyImage
        image={image}
        alt={altText}
        style={{ backgroundPosition }}
        objectFit={objectFit}
      />
    </div>
  ) : (
    <></>
  )
  const thisJsxWrapper = parallaxSpeed ? (
    <div key={thisId}>
      <ParallaxProvider>
        <Parallax speed={parallaxSpeed}>{thisJsx}</Parallax>
      </ParallaxProvider>
    </div>
  ) : (
    thisJsx
  )
  return {
    children: [thisJsxWrapper],
    css,
  }
}

const ParagraphBackgroundVideoCompositor = (
  payload: IPaneFragmentBackgroundVideo,
  viewportKey: string,
) => {
  const thisId = `${viewportKey}-${payload.id}-video`
  const zIndex = `` // `z-index: ${payload?.zindex || `100`};`
  const hasMaskShape =
    payload.imageMaskShape !== `none` ? payload.imageMaskShape : null
  const hasMaskPayload =
    hasMaskShape && hasMaskShape.length
      ? SvgImageMaskPayload(hasMaskShape, thisId, viewportKey)
      : false
  const cssMask = hasMaskPayload || ``
  const url = payload?.cdnUrl
  const altText =
    payload?.altText ||
    `We care about accessibility and apologize for this missing video description. This should not happen.`
  const css = `#${thisId} { ${zIndex} ${cssMask} }`
  const thisJsx = (url && altText && (
    <div id={thisId} key={thisId} className="paneFragment paneFragmentVideo">
      <video autoPlay={true} muted loop title={altText}>
        <source src={url} type="video/mp4" />
      </video>
    </div>
  )) || <></>
  return {
    children: [thisJsx],
    css,
  }
}

const ParagraphSvgCompositor = (
  payload: IPaneFragmentSvg,
  viewportKey: string,
) => {
  const thisId = `${viewportKey}-${payload.id}-svg`
  const zIndex = `` // `z-index: ${payload?.zindex || `101`};`
  const optionsPayload = payload.optionsPayload
  const parallaxSpeed = optionsPayload?.parallaxSpeed || false
  const hasMaskShape =
    payload.imageMaskShape !== `none` ? payload.imageMaskShape : false
  const hasMaskPayload =
    hasMaskShape && hasMaskShape.length
      ? SvgImageMaskPayload(hasMaskShape, thisId, viewportKey)
      : false
  const cssMask = hasMaskPayload || ``
  const url = payload?.relationships?.svgFile?.localFile?.publicURL
  const altText =
    payload?.svgTitle?.description ||
    `We care about accessibility and apologize for this missing video description. This should not happen.`
  const css = `#${thisId} { ${zIndex} ${cssMask} } `
  const thisJsx = (url && altText && (
    <div id={thisId} key={thisId} className="paneFragment paneFragmentSvg">
      <img src={url} alt={altText} />
    </div>
  )) || <></>
  const thisJsxWrapper = parallaxSpeed ? (
    <div key={thisId}>
      <ParallaxProvider>
        <Parallax speed={parallaxSpeed}>{thisJsx}</Parallax>
      </ParallaxProvider>
    </div>
  ) : (
    thisJsx
  )

  return {
    children: [thisJsxWrapper],
    css,
  }
}
*/

const ParagraphBackgroundColourCompositor = (
  payload: IPaneFragmentBackgroundColour,
  viewportKey: string,
  paneId: string
) => {
  const bgColour =
    (typeof payload.bgColour === `string` &&
      `background-color: ${payload.bgColour};`) ||
    ``;
  const zIndex = ``; // `z-index: 50;`
  const thisId = `${viewportKey}-${paneId}`;
  const css = `#${thisId} { ${bgColour} ${zIndex} } `;
  return {
    children: [],
    css,
  };
};

export const ParseOptions = (payload: string) => {
  let action;
  try {
    action = JSON.parse(payload);
  } catch (e) {
    if (e instanceof SyntaxError) {
      console.log(`ERROR parsing json options: `, e);
      return null;
    }
  }
  return action;
};

export const ParseImpressions = (payload: IImpressionDict, parent: string) => {
  const thisPayload: any = [];
  Object.keys(payload).forEach((impression) => {
    const thisImpression = payload[impression];
    thisPayload.push(thisImpression);
    thisImpression.parentId = parent;
  });
  return {
    payload: thisPayload,
  };
};
