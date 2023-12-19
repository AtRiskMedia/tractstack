// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useRef, useEffect } from "react"
import * as ReactDOMServer from "react-dom/server"

import { SvgBreaks, SvgPanes, SvgModals } from "./shapes"
import { lispLexer } from "./lexer"
import { concierge } from "./concierge"
import { IStoryFragmentId } from "./types"

global.Buffer = global.Buffer || require(`buffer`).Buffer

export function useInterval(callback: any, delay: number | null) {
  const savedCallback: any = useRef()
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

// from https://tobbelindstrom.com/blog/measure-scrollbar-width-and-height/
export const getScrollbarSize = () => {
  const { body } = document
  const scrollDiv = document.createElement(`div`)

  // Append element with defined styling
  scrollDiv.setAttribute(
    `style`,
    `width: 1337px; height: 1337px; position: absolute; left: -9999px; overflow: scroll;`,
  )
  body.appendChild(scrollDiv)
  // Collect width & height of scrollbar
  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
  // Remove element
  body.removeChild(scrollDiv)
  return scrollbarWidth
}

export const viewportWidth: any = {
  mobile: 600,
  tablet: 1080,
  desktop: 1920,
  server: 0,
}

export const SocialIcons = ({
  name,
  ariaHidden = true,
  className = ``,
}: {
  name: string
  ariaHidden: boolean
  className: string
}) => {
  switch (name) {
    case `Twitter`:
      return (
        <svg
          fill="currentColor"
          viewBox="0 0 24 24"
          className={className}
          aria-hidden={ariaHidden}
        >
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      )

    case `GitLab`:
      return (
        <svg
          fill="currentColor"
          viewBox="0 0 380 380"
          className={className}
          aria-hidden={ariaHidden}
        >
          <path d="m 361.18739,157.75722 -0.49207,-1.29831 -47.63959,-128.362872 a 12.411079,12.813709 0 0 0 -4.90247,-6.09639 12.75735,13.171214 0 0 0 -14.57983,0.809088 12.75735,13.171214 0 0 0 -4.22815,6.623239 L 257.17853,131.03847 H 126.92599 L 94.75925,29.431975 a 12.502203,12.907789 0 0 0 -4.228152,-6.642055 12.75735,13.171214 0 0 0 -14.579829,-0.809088 12.520428,12.926605 0 0 0 -4.902467,6.09639 l -47.730714,128.306428 -0.473844,1.29831 a 88.46311,91.332957 0 0 0 29.341904,105.55787 l 0.164024,0.1317 0.437395,0.31988 72.571093,56.10937 35.90283,28.05469 21.86974,17.0473 a 14.707403,15.184527 0 0 0 17.7874,0 l 21.86974,-17.0473 35.90282,-28.05469 73.0085,-56.44806 0.18224,-0.15053 a 88.499559,91.370589 0 0 0 29.30546,-105.44497 z" />
        </svg>
      )

    case `GitHub`:
      return (
        <svg
          fill="currentColor"
          viewBox="0 0 24 24"
          className={className}
          aria-hidden={ariaHidden}
        >
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      )

    default:
      return <></>
  }
}

export const Svg = (shapeName: string, viewportKey: string, id: string) => {
  const shapeData =
    typeof SvgPanes[shapeName] !== `undefined` &&
    typeof SvgPanes[shapeName][viewportKey] !== `undefined`
      ? SvgPanes[shapeName][viewportKey]
      : typeof SvgBreaks[shapeName] !== `undefined`
        ? SvgBreaks[shapeName]
        : typeof SvgModals[shapeName] !== `undefined`
          ? SvgModals[shapeName]
          : null
  return (
    shapeData && (
      <svg
        id={`svg__${id}`}
        data-name={`svg__${shapeName}--${viewportKey}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${shapeData.viewBox[0]} ${shapeData.viewBox[1]}`}
        className={`svg svg__${shapeName} svg__${shapeName}--${viewportKey}`}
      >
        <desc id="desc">decorative background</desc>
        <g>
          <path d={shapeData.path} />
        </g>
      </svg>
    )
  )
}

export const SvgImageMaskPayload = (
  shapeName: string,
  thisId: string,
  viewportKey: string,
) => {
  const shape = Svg(shapeName, viewportKey, thisId)
  const svgString =
    typeof shape === `object`
      ? ReactDOMServer.renderToStaticMarkup(shape)
      : false
  const b64 =
    typeof svgString === `string`
      ? Buffer.from(svgString, `utf8`).toString(`base64`)
      : null
  const dataUri = b64 && `data:image/svg+xml;base64,${b64}`
  const css = dataUri
    ? `-webkit-mask-image: url("${dataUri}"); mask-image: url("${dataUri}"); ` +
      `mask-repeat: no-repeat; -webkit-mask-size: 100% AUTO; mask-size: 100% AUTO; `
    : ``
  return css
}

export const SvgShapeOutsidePayload = (
  shapeName: string,
  viewportKey: string,
  thisId: string,
  paneHeight: number,
  isModal: boolean = false,
  modalPayload: any | boolean = false,
) => {
  const thisWidth = viewportWidth[viewportKey]
  const shapeData =
    !modalPayload &&
    typeof SvgPanes[shapeName] !== `undefined` &&
    typeof SvgPanes[shapeName][viewportKey] !== `undefined`
      ? SvgPanes[shapeName][viewportKey]
      : typeof modalPayload === `object` &&
          typeof SvgModals[shapeName] !== `undefined`
        ? SvgModals[shapeName]
        : null
  if (shapeData === null) return null
  const multiplier: number = modalPayload?.zoomFactor
    ? parseFloat(parseFloat(modalPayload.zoomFactor).toFixed(4))
    : 1
  const width = parseInt(shapeData.viewBox[0]) * multiplier
  const height = parseInt(shapeData.viewBox[1]) * multiplier
  const cut = parseInt(shapeData.cut) * multiplier
  const paddingLeft = parseInt(modalPayload?.paddingLeft) * multiplier || 0
  const paddingTop = parseInt(modalPayload?.paddingTop) * multiplier || 0
  const viewBox = (!modalPayload && {
    left: `0 0 ${cut} ${width}`,
    right: `${cut} 0 ${width - cut} ${height}`,
    leftMask: `0 0 ${cut} ${height}`,
    rightMask: `${cut} 0 ${width - cut} ${height}`,
    rightMaskWidth: thisWidth - cut,
  }) || {
    left: `${-paddingLeft} ${-paddingTop} ${cut + paddingLeft} ${paneHeight}`,
    right: `${cut} ${-paddingTop} ${
      thisWidth - (width - cut + paddingLeft)
    } ${paneHeight}`,
    leftMask: `${-paddingLeft} ${-paddingTop} ${
      cut + paddingLeft
    } ${paneHeight}`,
    rightMask: `${cut} ${-paddingTop} ${
      thisWidth - (width - cut + paddingLeft)
    } ${paneHeight}`,
    rightMaskWidth: thisWidth - (width - cut + paddingLeft),
  }
  const thisWidthLeft = cut + paddingLeft
  const thisWidthRight = thisWidth - thisWidthLeft
  const leftMaskSvg = (
    <svg
      id={`svg__${thisId}--shape-outside-left-mask`}
      data-name={`svg-shape-outside-mask__${shapeName}-left--${viewportKey}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox.leftMask}
      className={`svg svg-shape-outside svg-shape-outside__${shapeName}-left svg-shape-outside__${shapeName}--${viewportKey} svg-shape-outside__${shapeName}-left--${viewportKey}`}
    >
      <desc id="desc">decorative background</desc>
      <mask id={`svg__${thisId}--shape-outside-left-mask-cutout`}>
        <rect
          fill="white"
          x={-paddingLeft}
          y={-paddingTop}
          width={cut + paddingLeft}
          height={paneHeight + paddingTop}
        ></rect>
        <g transform={`scale(${multiplier} ${multiplier})`}>
          <path d={isModal ? shapeData.innerPath : shapeData.path} />
        </g>
      </mask>
      <rect
        mask={`url(#svg__${thisId}--shape-outside-left-mask-cutout)`}
        x={-paddingLeft}
        y={-paddingTop}
        width={cut + paddingLeft}
        height={paneHeight + paddingTop}
      ></rect>
    </svg>
  )
  const rightMaskSvg = (
    <svg
      id={`svg__${thisId}--shape-outside-right-mask`}
      data-name={`svg-shape-outside-mask__${shapeName}-right--${viewportKey}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox.rightMask}
      className={`svg svg-shape-outside svg-shape-outside__${shapeName}-right svg-shape-outside__${shapeName}--${viewportKey} svg-shape-outside__${shapeName}-right--${viewportKey}`}
    >
      <desc id="desc">decorative background</desc>
      <mask id={`svg__${thisId}--shape-outside-right-mask-cutout`}>
        <rect
          fill="white"
          x={cut}
          y={-paddingTop}
          width={viewBox.rightMaskWidth}
          height={paneHeight + paddingTop}
        ></rect>
        <g transform={`scale(${multiplier} ${multiplier})`}>
          <path d={isModal ? shapeData.innerPath : shapeData.path} />
        </g>
      </mask>
      <rect
        mask={`url(#svg__${thisId}--shape-outside-right-mask-cutout)`}
        x={cut}
        y={-paddingTop}
        width={viewBox.rightMaskWidth}
        height={paneHeight + paddingTop}
      ></rect>
    </svg>
  )
  const svgStringLeft = ReactDOMServer.renderToStaticMarkup(leftMaskSvg)
  const b64Left =
    typeof svgStringLeft === `string`
      ? Buffer.from(svgStringLeft, `utf8`).toString(`base64`)
      : null
  const leftMask = `data:image/svg+xml;base64,${b64Left}`
  const svgStringRight = ReactDOMServer.renderToStaticMarkup(rightMaskSvg)
  const b64Right =
    typeof svgStringRight === `string`
      ? Buffer.from(svgStringRight, `utf8`).toString(`base64`)
      : null
  const rightMask = `data:image/svg+xml;base64,${b64Right}`
  const left = (
    <svg
      id={`svg__${thisId}--shape-outside-left`}
      data-name={`svg-shape-outside__${shapeName}--${viewportKey}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox.leftMask}
      className={
        `svg svg-shape-outside svg-shape-outside-left svg-shape-outside__${shapeName}-left ` +
        `svg-shape-outside__${shapeName}-left--${viewportKey}`
      }
    >
      <desc id="desc">decorative background</desc>
      <g transform={`scale(${multiplier} ${multiplier})`}>
        <path d={isModal ? shapeData.innerPath : shapeData.path} />
      </g>
    </svg>
  )
  const right = (
    <svg
      id={`svg__${thisId}--shape-outside-right`}
      data-name={`svg-shape-outside__${shapeName}--${viewportKey}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox.rightMask}
      className={
        `svg svg-shape-outside svg-shape-outside-right svg-shape-outside__${shapeName}-right ` +
        `svg-shape-outside__${shapeName}-right--${viewportKey}`
      }
    >
      <desc id="desc">decorative background</desc>
      <g transform={`scale(${multiplier} ${multiplier})`}>
        <path d={isModal ? shapeData.innerPath : shapeData.path} />
      </g>
    </svg>
  )
  const isShapeOutside = !isModal
    ? `svg__shape-outside svg__shape-outside--${viewportKey}-${shapeName}`
    : ``
  const shape = (
    <svg
      id={`svg__${thisId}`}
      data-name={`svg__${shapeName}--${viewportKey}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${shapeData.viewBox[0]} ${shapeData.viewBox[1]}`}
      className={`svg ${isShapeOutside} svg__${shapeName}--${viewportKey}`}
    >
      <desc id="desc">decorative background</desc>
      <g>
        <path d={shapeData.path} />
      </g>
    </svg>
  )
  const cssShapeOutside =
    !isModal && typeof modalPayload !== `object`
      ? `#svg__${thisId}--shape-outside-left { float:left; shape-outside: url(${leftMask}); } ` +
        `#svg__${thisId}--shape-outside-right { float:right; shape-outside: url(${rightMask}); } `
      : typeof modalPayload === `object`
        ? `#svg__${thisId}--shape-outside-left { ` +
          `width: calc( var(--scale) * ${thisWidthLeft} * 1px ); ` +
          `float:left; shape-outside: url(${leftMask}); } ` +
          `#svg__${thisId}--shape-outside-right { ` +
          `width: calc( var(--scale) * ${thisWidthRight} * 1px ); ` +
          `float:right; shape-outside: url(${rightMask}); } `
        : ``
  const cssModal =
    typeof modalPayload === `object`
      ? `#svg__${thisId}, #svg__${thisId} ` +
        `{ width: calc(var(--scale) * ${width} * 1px ); ` +
        `margin-left: calc( var(--scale) * ${paddingLeft} * 1px ); ` +
        `margin-top: calc( var(--scale) * ${paddingTop} * 1px ); } `
      : ``
  return {
    shape,
    left,
    right,
    leftMask,
    rightMask,
    css: `${cssShapeOutside} ${cssModal}`,
  }
}

export const getControllerPayload = (
  isExpanded: boolean,
  viewportKey: string,
) => {
  const shapeName = isExpanded ? `controllerExpanded` : `controllerMinimized`
  const thisId = `${shapeName}-${viewportKey}`
  return SvgImageMaskPayload(shapeName, thisId, viewportKey)
}

export const HtmlAstToReact = (
  payload: any,
  element: any[] | boolean = false,
  thisClassNames: any = {},
  hooks: any,
  memory: any = {},
  id: IStoryFragmentId,
  idx: number = 0,
) => {
  // recursive function
  const interceptEditInPlace = hooks?.EditInPlace
  const newMemory = { ...memory }
  let contents, rawElement, raw
  if (element) raw = element
  else if (typeof payload?.ast === `object`) raw = payload.ast
  else return null
  const composed = raw
    .filter((e: any) => !(e?.type === `text` && e?.value === `\n`))
    .map((e: any, thisIdx: number) => {
      if (e?.type === `text`) {
        if (e?.value === `\n`) return null
        return e?.value
      }
      const Tag = e?.tagName
      const thisId = `${idx}-${thisIdx}`
      const thisBuilderId = `${Tag}-${thisIdx}`
      let injectClassNames
      const injectClassNamesRaw =
        e?.tagName && typeof thisClassNames[e?.tagName] !== `undefined`
          ? thisClassNames[e?.tagName]
          : ``
      if (injectClassNamesRaw && typeof injectClassNamesRaw === `string`) {
        injectClassNames = injectClassNamesRaw
      } else if (
        e?.tagName &&
        injectClassNamesRaw &&
        typeof injectClassNamesRaw === `object`
      ) {
        if (typeof memory[e.tagName] !== `undefined`)
          memory[e.tagName] = memory[e.tagName] + 1
        else memory[e.tagName] = 0
        injectClassNames = injectClassNamesRaw[memory[e.tagName]]
      }
      switch (e?.tagName) {
        case `p`:
          contents = e?.children?.map((p: any) => {
            // use recursion to compose the MarkdownParagraph
            return HtmlAstToReact(
              payload,
              [p],
              thisClassNames,
              hooks,
              memory,
              id,
              idx + 1,
            )
          })
          if (id?.isBuilderPreview && interceptEditInPlace)
            return (
              <div
                className="builder relative z-10"
                id={thisBuilderId}
                key={thisId}
              >
                {interceptEditInPlace({
                  nth: thisIdx,
                  Tag: e?.tagName,
                  value: (
                    <div key={thisId} className={classNames(injectClassNames)}>
                      {contents}
                    </div>
                  ),
                  className: injectClassNames,
                })}
              </div>
            )
          return (
            <p key={thisId} className={classNames(injectClassNames)}>
              {contents}
            </p>
          )

        case `h1`:
        case `h2`:
        case `h3`:
        case `h4`:
        case `h5`:
        case `h6`:
          if (id?.isBuilderPreview && interceptEditInPlace)
            return (
              <div
                className="builder relative z-10"
                id={thisBuilderId}
                key={thisId}
              >
                {interceptEditInPlace({
                  nth: thisIdx,
                  Tag: e?.tagName,
                  value: (
                    <div className={classNames(injectClassNames)} key={thisId}>
                      {e?.children[0].value}
                    </div>
                  ),
                  className: injectClassNames,
                })}
              </div>
            )
          return (
            <Tag className={classNames(injectClassNames)} key={thisId}>
              {e?.children[0].value}
            </Tag>
          )

        case `a`:
          if (
            typeof e?.properties?.href === `string` &&
            e?.children[0]?.type === `text` &&
            typeof e?.children[0]?.value === `string`
          ) {
            // check for buttons action payload
            // requires match on button's urlTarget === link's href
            let isButton
            if (
              typeof payload?.buttonData === `object` &&
              Object.keys(payload?.buttonData).length
            ) {
              const target = e?.properties?.href
              if (target && typeof payload?.buttonData[target] !== `undefined`)
                isButton = payload?.buttonData[target]
            }
            const isExternalUrl =
              typeof e?.properties?.href === `string` &&
              e.properties.href.substring(0, 8) === `https://`

            // if (id?.isBuilderPreview && interceptEditInPlace)
            //  return ` [${e?.children[0].value}](${e.properties.href}) `
            if (id?.isBuilderPreview && interceptEditInPlace)
              return (
                <a
                  className={isButton?.className || injectClassNames}
                  key={thisId}
                  href={e.properties.href}
                >
                  {e?.children[0].value}
                </a>
              )
            else if (id?.isBuilderPreview)
              return (
                <button
                  type="button"
                  className={isButton?.className || injectClassNames}
                  key={thisId}
                  value={e.properties.href}
                >
                  {e?.children[0].value}
                </button>
              )
            else if (isExternalUrl) {
              return (
                <a
                  target="_blank"
                  rel="noreferrer"
                  className={isButton?.className || injectClassNames}
                  key={thisId}
                  href={e.properties.href}
                >
                  {e?.children[0].value}
                </a>
              )
            } else if (isButton) {
              // inject button with callback function, add css className
              const thisButtonPayload = lispLexer(isButton?.callbackPayload)
              const injectPayload = function (): void {
                concierge(thisButtonPayload, hooks, id, payload.parent)
              }
              return (
                <button
                  type="button"
                  className={isButton?.className || injectClassNames}
                  key={thisId}
                  onClick={injectPayload}
                >
                  {e?.children[0].value}
                </button>
              )
            }
            // else, treat at internal link to a storyfragment
            const thisPayload = lispLexer(
              `(hookGotoStoryFragment (${e?.properties?.href}))`,
            )
            return (
              <button
                className={isButton?.className || injectClassNames}
                onClick={() => concierge(thisPayload, hooks, id)}
                key={thisId}
              >
                {e?.children[0].value}
              </button>
            )
          }
          break

        case `img`: {
          // check for alt text
          const altText =
            e?.properties?.alt ||
            `This should be descriptive text of an image | We apologize the alt text is missing.`
          // check for image and imageWrapper style tag
          let injectClassNamesImgWrapper
          let injectClassNamesImg
          const injectClassNamesImgRawWrapper =
            e?.tagName && typeof thisClassNames.imgWrapper !== `undefined`
              ? thisClassNames.imgWrapper
              : ``
          const injectClassNamesImgRaw =
            e?.tagName && typeof thisClassNames.img !== `undefined`
              ? thisClassNames.img
              : ``
          if (
            injectClassNamesImgRawWrapper &&
            typeof injectClassNamesImgRawWrapper === `string`
          ) {
            injectClassNamesImgWrapper = injectClassNamesImgRawWrapper
          } else if (
            e?.tagName &&
            injectClassNamesImgRawWrapper &&
            typeof injectClassNamesImgRawWrapper === `object`
          ) {
            if (e?.tagName && typeof memory.imgWrapper !== `undefined`)
              memory.imgWrapper = memory.imgWrapper + 1
            else memory.imgWrapper = 0
            injectClassNamesImgWrapper =
              injectClassNamesImgRawWrapper[memory.img]
          }
          if (
            injectClassNamesImgRaw &&
            typeof injectClassNamesImgRaw === `string`
          ) {
            injectClassNamesImg = injectClassNamesImgRaw
          } else if (
            e?.tagName &&
            injectClassNamesImgRaw &&
            typeof injectClassNamesImgRaw === `object`
          ) {
            if (e?.tagName && typeof memory.img !== `undefined`)
              memory.img = memory.img + 1
            else memory.img = 0
            injectClassNamesImg = injectClassNamesImgRaw[memory.img]
          }
          const pass = /\.[A-Za-z0-9]+$/
          const extcheck = e?.properties?.src?.match(pass)

          if (
            extcheck &&
            (extcheck[0] === `.png` ||
              extcheck[0] === `.jpg` ||
              extcheck[0] === `.gif`)
          ) {
            // imageData in this case is an array ... assumes image is first element
            const thisImageDataRaw = payload?.imageData?.filter(
              (image: any) => image.filename === e?.properties?.src,
            )[0]
            // payload?.mode === `paragraph__markdown` ? `contain` : `cover`
            // --  no longer using GatsbyImage
            /*
              const thisImageDataRaw = payload?.imageData?.filter(
                (image: any) => image.filename === e?.properties?.src,
              )[0]
              const thisImageData =
                thisImageDataRaw &&
                typeof thisImageDataRaw[payload?.viewportKey] !== `undefined` &&
                thisImageDataRaw[payload.viewportKey]?.childImageSharp
                  ?.gatsbyImageData
              const objectFitMode =
                payload?.mode === `paragraph__markdown` ? `contain` : `cover`
              if (thisImageData)
                return (
                  <GatsbyImage
                    className={classNames(
                      injectClassNames,
                      injectClassNamesImgWrapper,
                    )}
                    imgClassName={injectClassNamesImg}
                    key={thisId}
                    title={altText}
                    alt={e?.properties?.alt}
                    image={thisImageData}
                    objectFit={objectFitMode}
                  />
                )
            */
            if (id?.isBuilderPreview && interceptEditInPlace) {
              const image = (
                <img
                  className={classNames(
                    injectClassNames,
                    injectClassNamesImgWrapper,
                    injectClassNamesImg,
                  )}
                  key={thisId}
                  src={thisImageDataRaw?.localFile?.publicURL}
                />
              )
              return (
                <div
                  className="builder relative z-10"
                  id={thisBuilderId}
                  key={thisId}
                >
                  {interceptEditInPlace({
                    nth: memory.child,
                    Tag: e?.tagName,
                    value: image,
                    parent: memory.parent,
                    className: injectClassNames,
                  })}
                </div>
              )
            }
            return (
              <img
                className={classNames(
                  injectClassNames,
                  injectClassNamesImgWrapper,
                  injectClassNamesImg,
                )}
                key={thisId}
                src={thisImageDataRaw?.localFile?.publicURL}
                title={altText}
                alt={e?.properties?.alt}
              />
            )
          } else if (extcheck && extcheck[0] === `.svg`) {
            const thisImageDataRaw = payload?.imageData.filter(
              (image: any) => image.filename === e?.properties?.src,
            )[0]
            const image = (
              <img
                key={thisId}
                src={thisImageDataRaw?.localFile?.publicURL}
                title={altText}
                className={classNames(injectClassNames, injectClassNamesImg)}
              />
            )
            if (id?.isBuilderPreview && interceptEditInPlace)
              return (
                <div
                  className="builder relative z-10"
                  id={thisBuilderId}
                  key={thisId}
                >
                  {interceptEditInPlace({
                    nth: memory.child,
                    Tag: e?.tagName,
                    value: image,
                    parent: memory.parent,
                    className: injectClassNames,
                  })}
                </div>
              )
            return image
          }
          break
        }
        case `code`: {
          // if (typeof hooks.template === `undefined`) return null
          // currently only supports inject, belief, youtube and resource
          const regexpHook = /(youtube|toggle|resource|belief)\((.*?)\)/
          const regexpValues = /((?:[^\\|]+|\\\|?)+)/g
          const thisHookRaw = e.children[0].value.match(regexpHook)
          const hook =
            thisHookRaw && typeof thisHookRaw[1] === `string`
              ? thisHookRaw[1]
              : null
          const thisHookPayload =
            thisHookRaw && typeof thisHookRaw[2] === `string`
              ? thisHookRaw[2]
              : null
          const thisHookValuesRaw =
            thisHookPayload && thisHookPayload.match(regexpValues)
          const value1 =
            thisHookValuesRaw && thisHookValuesRaw.length
              ? thisHookValuesRaw[0]
              : null
          const value2 =
            thisHookValuesRaw && thisHookValuesRaw.length > 1
              ? thisHookValuesRaw[1]
              : null
          const value3 =
            thisHookValuesRaw && thisHookValuesRaw.length > 2
              ? thisHookValuesRaw[2]
              : null
          const injectClassNamesExtra =
            typeof thisClassNames.codeExtra !== `undefined`
              ? thisClassNames.codeExtra
              : ``
          if (!hook) return <></>
          if (id?.isBuilderPreview && !interceptEditInPlace)
            return (
              <div
                className="builder relative z-10"
                id={thisBuilderId}
                key={thisId}
              >
                <p className={injectClassNames}>
                  Code hook: {hook} = {value1} | {value2}
                </p>
              </div>
            )
          if (
            hook === `belief` &&
            value1 &&
            value2 &&
            id?.isBuilderPreview &&
            interceptEditInPlace
          )
            return (
              <div
                className={classNames(
                  injectClassNames,
                  `builder relative z-10`,
                )}
                id={thisBuilderId}
                key={thisId}
              >
                {interceptEditInPlace({
                  nth: memory.child,
                  Tag: e?.tagName,
                  value: `Belief widget: ${value1}`,
                  parent: memory.parent,
                })}
              </div>
            )
          else if (hook === `belief` && value1 && value2) {
            const Belief = hooks.belief
            return (
              <Belief
                key={thisId}
                value={{ slug: value1, scale: value2, extra: value3 }}
                cssClasses={injectClassNames}
                cssClassesExtra={injectClassNamesExtra}
                storyFragmentId={id}
              />
            )
          } else if (
            hook === `inject` &&
            value1 &&
            id?.isBuilderPreview &&
            interceptEditInPlace
          )
            return (
              <div
                className={classNames(
                  injectClassNames,
                  `builder relative z-10`,
                )}
                id={thisBuilderId}
                key={thisId}
              >
                {interceptEditInPlace({
                  nth: memory.child,
                  Tag: e?.tagName,
                  value: `Inject component: widget ${value1}`,
                  parent: memory.parent,
                })}
              </div>
            )
          else if (hook === `inject` && value1) {
            const InjectComponent = hooks?.templates?.injectComponent
            if (InjectComponent)
              return <InjectComponent key={thisId} target={value1} />
          } else if (
            hook === `toggle` &&
            value1 &&
            value2 &&
            value3 &&
            id?.isBuilderPreview &&
            interceptEditInPlace
          )
            return (
              <div
                className={classNames(
                  injectClassNames,
                  `builder relative z-10`,
                )}
                id={thisBuilderId}
                key={thisId}
              >
                {interceptEditInPlace({
                  nth: memory.child,
                  Tag: e?.tagName,
                  value: `Toggle belief: ${value1}`,
                  parent: memory.parent,
                })}
              </div>
            )
          else if (hook === `toggle` && value1 && value2 && value3) {
            const ToggleBelief = hooks?.toggle
            return (
              <ToggleBelief
                key={thisId}
                belief={value1}
                value={value2}
                prompt={value3}
                storyFragmentId={id}
                cssClasses={injectClassNamesExtra}
              />
            )
          } else if (
            hook === `youtube` &&
            value1 &&
            value2 &&
            id?.isBuilderPreview &&
            interceptEditInPlace
          )
            return (
              <div
                className={classNames(
                  injectClassNames,
                  `builder relative z-10`,
                )}
                id={thisBuilderId}
                key={thisId}
              >
                {interceptEditInPlace({
                  nth: memory.child,
                  Tag: e?.tagName,
                  value: `YouTube embed: ${value2}`,
                  parent: memory.parent,
                })}
              </div>
            )
          else if (hook === `youtube` && value1 && value2) {
            const YouTube = hooks?.youtube
            return (
              <YouTube
                key={thisId}
                videoId={value1}
                title={value2}
                cssClasses={injectClassNames}
              />
            )
          } else if (
            hook === `resource` &&
            value1 &&
            value2 &&
            id?.isBuilderPreview &&
            interceptEditInPlace
          )
            return (
              <div
                className={classNames(
                  injectClassNames,
                  `builder relative z-10`,
                )}
                id={thisBuilderId}
                key={thisId}
              >
                {interceptEditInPlace({
                  nth: memory.child,
                  Tag: e?.tagName,
                  value: `Resource embed: ${value1} | ${value2}`,
                  parent: memory.parent,
                })}
              </div>
            )
          else if (hook === `resource` && value1 && value2) {
            const values =
              value1[0] === `*` ? value1.substring(1) : value1.split(/[,]+/)
            const resources =
              value1[0] === `*`
                ? hooks?.resourcePayload?.filter(
                    (e: any) => values?.includes(e?.node?.categorySlug),
                  )
                : hooks?.resourcePayload?.filter(
                    (e: any) => values?.includes(e?.node?.slug),
                  )
            const template =
              hooks?.templates &&
              Object.prototype.hasOwnProperty.call(hooks?.templates, value2) &&
              hooks.templates[value2]
            if (resources && template)
              return template(
                resources,
                id,
                id.viewportKey,
                {
                  ...hooks,
                  concierge,
                },
                injectClassNames,
              )
            return null
          } else return null
          break
        }

        case `ul`:
        case `ol`:
          rawElement = e?.children.filter(
            (e: any) => !(e.type === `text` && e.value === `\n`),
          )
          newMemory.parent = thisIdx
          contents = HtmlAstToReact(
            payload,
            rawElement,
            thisClassNames,
            hooks,
            newMemory,
            id,
            idx + 1,
          )
          if (id?.isBuilderPreview && interceptEditInPlace)
            return (
              <Tag
                key={thisId}
                id={thisBuilderId}
                className={classNames(injectClassNames)}
              >
                {contents}
              </Tag>
            )
          return (
            <Tag key={thisId} className={classNames(injectClassNames)}>
              {contents}
            </Tag>
          )

        case `li`:
          newMemory.child = thisIdx
          contents = e?.children?.map((li: any) => {
            return HtmlAstToReact(
              payload,
              [li],
              thisClassNames,
              hooks,
              newMemory,
              id,
              thisIdx,
            )
          })
          if (
            id?.isBuilderPreview &&
            interceptEditInPlace &&
            typeof contents === `object` &&
            typeof contents[0] === `object` &&
            typeof contents[0][0] === `string`
          )
            return (
              <div
                className="li builder relative z-10"
                id={`${Tag}-${memory.parent}-${thisIdx}`}
                key={thisId}
              >
                {interceptEditInPlace({
                  nth: thisIdx,
                  parent: memory.parent,
                  Tag: e?.tagName,
                  value: (
                    <div className={classNames(injectClassNames)} key={thisId}>
                      {contents[0][0]}
                    </div>
                  ),
                  className: injectClassNames,
                })}
              </div>
            )
          return (
            <li className={classNames(injectClassNames)} key={thisId}>
              {contents[0][0]}
            </li>
          )

        case `br`:
          return <br key={thisId} />

        case `em`:
          if (typeof e?.children[0]?.value === `string`) {
            return <em key={thisId}>{e?.children[0]?.value}</em>
          }
          break

        case `strong`:
          if (typeof e?.children[0]?.value === `string`) {
            return <strong key={thisId}>{e?.children[0]?.value}</strong>
          }
          break

        /*
        case `blockquote`:
          rawElement = e?.children.filter(
            (e: any) => !(e.type === `text` && e.value === `\n`),
          )
          contents = HtmlAstToReact(
            payload,
            rawElement,
            thisClassNames,
            hooks,
            memory,
            id,
            idx + 1,
          )
          if (typeof e?.children[0]?.value === `string`) {
            return (
            <blockquote className={classNames(injectClassNames)} key={thisId}>
              {contents}
            </blockquote>
            )
          }
            break
            */

        default:
          console.log(`helpers.js: MISS on`, e)
      }
      return null
    })
  return composed
}

export const getLogo = (
  fieldSvgLogo: any,
  fieldImageLogo: any,
  viewportKey: string,
  GatsbyImage: any, // FIX
) => {
  // svg or image logo?
  if (typeof fieldSvgLogo?.localFile?.publicURL === `string`) {
    // svg logo
    const thisImageId = fieldSvgLogo?.id
    const thisImage = fieldSvgLogo?.localFile?.publicURL
    return (
      <img
        key={thisImageId}
        src={thisImage}
        className={`menu__logo`}
        alt="Logo"
      />
    )
  } else if (
    typeof fieldImageLogo?.localFile?.childImageSharp[viewportKey] !==
    `undefined`
  ) {
    const thisImageId = fieldImageLogo?.id
    const thisImage = fieldImageLogo?.localFile?.childImageSharp[viewportKey]
    // image logo
    return (
      <GatsbyImage
        key={thisImageId}
        className={`menu__logo`}
        alt="Logo"
        image={thisImage}
        objectFit="contain"
      />
    )
  }
  return <></>
}

export const tractStackGraph = (data: any) => {
  const tractStackId = data[0].node.relationships.tractstack.id
  const tractStackTitle = data[0].node.relationships.tractstack.title
  const graph = data.map((e: any) => {
    const storyFragmentId = e.node.id
    const storyFragmentTitle = e.node.title
    const storyFragmentSlug = e.node.slug
    return {
      id: storyFragmentId,
      title: storyFragmentTitle,
      slug: storyFragmentSlug,
    }
  })
  return {
    id: tractStackId,
    title: tractStackTitle,
    graph,
  }
}

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(` `)
}

// modified from gatsby-shopify-starter
export const formatPrice = (currency: string, value: number | bigint) =>
  Intl.NumberFormat(`en-US`, {
    currency,
    minimumFractionDigits: 2,
    style: `currency`,
  }).format(value)

// modified from gatsby-shopify-starter
export const getCurrencySymbol = (
  currency: string,
  locale: string | undefined = undefined,
) => {
  if (!currency) {
    return
  }
  const formatter = Intl.NumberFormat(locale, {
    currency,
    style: `currency`,
  })
  const parts = formatter.formatToParts(100)
  const symbol = parts?.find(part => part.type === `currency`)?.value || `$`
  const formatted = formatter.format(100)
  const symbolAtEnd = formatted.endsWith(symbol)
  return { symbol, symbolAtEnd }
}
