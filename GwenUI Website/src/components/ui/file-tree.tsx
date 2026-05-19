"use client"

import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { FileIcon, FolderIcon, FolderOpenIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

type TreeViewElement = {
  id: string
  name: string
  type?: "file" | "folder"
  isSelectable?: boolean
  children?: TreeViewElement[]
}

type TreeSortMode =
  | "default"
  | "none"
  | ((a: TreeViewElement, b: TreeViewElement) => number)

type TreeContextProps = {
  selectedId: string | undefined
  expandedItems: string[] | undefined
  indicator: boolean
  handleExpand: (id: string) => void
  selectItem: (id: string) => void
  setExpandedItems?: React.Dispatch<React.SetStateAction<string[] | undefined>>
  openIcon?: React.ReactNode
  closeIcon?: React.ReactNode
  direction: "rtl" | "ltr"
}

const TreeContext = createContext<TreeContextProps | null>(null)

const useTree = () => {
  const context = useContext(TreeContext)
  if (!context) {
    throw new Error("useTree must be used within a TreeProvider")
  }
  return context
}

type Direction = "rtl" | "ltr" | undefined

const isFolderElement = (element: TreeViewElement) => {
  if (element.type) {
    return element.type === "folder"
  }

  return Array.isArray(element.children)
}

const mergeExpandedItems = (
  currentItems: string[] | undefined,
  nextItems: string[]
) => [...new Set([...(currentItems ?? []), ...nextItems])]

const treeCollator = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
})

const defaultTreeComparator = (a: TreeViewElement, b: TreeViewElement) => {
  const aIsFolder = isFolderElement(a)
  const bIsFolder = isFolderElement(b)

  if (aIsFolder !== bIsFolder) {
    return aIsFolder ? -1 : 1
  }

  return treeCollator.compare(a.name, b.name)
}

const getTreeComparator = (sort: TreeSortMode) => {
  if (sort === "none") {
    return undefined
  }

  if (sort === "default") {
    return defaultTreeComparator
  }

  return sort
}

const sortTreeElements = (
  elements: TreeViewElement[],
  sort: TreeSortMode
): TreeViewElement[] => {
  const comparator = getTreeComparator(sort)

  const nextElements = elements.map((element) => {
    if (!Array.isArray(element.children)) {
      return element
    }

    return {
      ...element,
      children: sortTreeElements(element.children, sort),
    }
  })

  if (!comparator) {
    return nextElements
  }

  return [...nextElements].sort(comparator)
}

const renderTreeElements = (
  elements: TreeViewElement[],
  sort: TreeSortMode
): React.ReactNode =>
  sortTreeElements(elements, sort).map((element) => {
    if (isFolderElement(element)) {
      return (
        <Folder
          key={element.id}
          value={element.id}
          element={element.name}
          isSelectable={element.isSelectable}
        >
          {Array.isArray(element.children)
            ? renderTreeElements(element.children, sort)
            : null}
        </Folder>
      )
    }

    return (
      <File
        key={element.id}
        value={element.id}
        isSelectable={element.isSelectable}
      >
        <span>{element.name}</span>
      </File>
    )
  })

// CVA variants for folder trigger styling
const folderTriggerVariants = cva(
  "flex items-center gap-2 rounded-lg text-xs font-mono transition-all duration-150 w-full text-left py-2 px-3 select-none",
  {
    variants: {
      isSelectable: {
        true: "cursor-pointer",
        false: "cursor-not-allowed opacity-50",
      },
      isSelected: {
        true: "bg-primary/10 border-l-2 border-primary text-foreground pl-2 font-bold",
        false: "text-muted-foreground hover:text-foreground hover:bg-accent/50",
      },
    },
    defaultVariants: {
      isSelectable: true,
      isSelected: false,
    },
  }
)

// CVA variants for file item styling
const fileVariants = cva(
  "flex w-full items-center gap-2 rounded-lg text-xs font-mono transition-all duration-150 select-none py-2 px-3 text-left",
  {
    variants: {
      isSelectable: {
        true: "cursor-pointer",
        false: "cursor-not-allowed opacity-50",
      },
      isSelected: {
        true: "bg-primary/10 border-l-2 border-primary text-foreground pl-2 font-bold",
        false: "text-muted-foreground hover:text-foreground hover:bg-accent/50",
      },
      direction: {
        rtl: "rtl pr-0 pl-2",
        ltr: "ltr",
      },
    },
    defaultVariants: {
      isSelectable: true,
      isSelected: false,
      direction: "ltr",
    },
  }
)

type TreeViewProps = {
  initialSelectedId?: string
  indicator?: boolean
  elements?: TreeViewElement[]
  initialExpandedItems?: string[]
  openIcon?: React.ReactNode
  closeIcon?: React.ReactNode
  sort?: TreeSortMode
} & Omit<
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>,
  "defaultValue" | "onValueChange" | "type" | "value"
>

const Tree = forwardRef<HTMLDivElement, TreeViewProps>(
  (
    {
      className,
      elements,
      initialSelectedId,
      initialExpandedItems,
      children,
      indicator = true,
      openIcon,
      closeIcon,
      sort = "default",
      dir,
      ...props
    },
    ref
  ) => {
    const [selectedId, setSelectedId] = useState<string | undefined>(
      initialSelectedId
    )
    const [expandedItems, setExpandedItems] = useState<string[] | undefined>(
      initialExpandedItems
    )

    const selectItem = useCallback((id: string) => {
      setSelectedId(id)
    }, [])

    const handleExpand = useCallback((id: string) => {
      setExpandedItems((prev) => {
        if (prev?.includes(id)) {
          return prev.filter((item) => item !== id)
        }
        return [...(prev ?? []), id]
      })
    }, [])

    const expandSpecificTargetedElements = useCallback(
      (elements?: TreeViewElement[], selectId?: string) => {
        if (!elements || !selectId) return
        const findParent = (
          currentElement: TreeViewElement,
          currentPath: string[] = []
        ) => {
          const isSelectable = currentElement.isSelectable ?? true
          const newPath = [...currentPath, currentElement.id]
          if (currentElement.id === selectId) {
            if (isSelectable) {
              setExpandedItems((prev) => mergeExpandedItems(prev, newPath))
            } else {
              if (newPath.includes(currentElement.id)) {
                newPath.pop()
                setExpandedItems((prev) => mergeExpandedItems(prev, newPath))
              }
            }
            return
          }
          if (
            Array.isArray(currentElement.children) &&
            currentElement.children.length > 0
          ) {
            currentElement.children.forEach((child) => {
              findParent(child, newPath)
            })
          }
        }
        elements.forEach((element) => {
          findParent(element)
        })
      },
      []
    )

    useEffect(() => {
      if (initialSelectedId) {
        expandSpecificTargetedElements(elements, initialSelectedId)
      }
    }, [initialSelectedId, elements, expandSpecificTargetedElements])

    const direction = dir === "rtl" ? "rtl" : "ltr"
    const treeChildren =
      children ?? (elements ? renderTreeElements(elements, sort) : null)

    return (
      <TreeContext.Provider
        value={{
          selectedId,
          expandedItems,
          handleExpand,
          selectItem,
          setExpandedItems,
          indicator,
          openIcon,
          closeIcon,
          direction,
        }}
      >
        <div className={cn("size-full", className)}>
          <ScrollArea
            ref={ref}
            className="relative h-full px-2"
          >
            <AccordionPrimitive.Root
              {...props}
              type="multiple"
              value={expandedItems}
              className="flex flex-col gap-1"
              dir={dir as Direction}
            >
              {treeChildren}
            </AccordionPrimitive.Root>
          </ScrollArea>
        </div>
      </TreeContext.Provider>
    )
  }
)

Tree.displayName = "Tree"

const TreeIndicator = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { direction } = useTree()

  return (
    <div
      dir={direction}
      ref={ref}
      className={cn(
        "bg-border absolute left-3.5 h-full w-px rounded-md duration-300 ease-in-out hover:bg-primary/40 rtl:right-3.5",
        className
      )}
      {...props}
    />
  )
})

TreeIndicator.displayName = "TreeIndicator"

type FolderProps = {
  expandedItems?: string[]
  element: string
  isSelectable?: boolean
  isSelect?: boolean
} & React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> &
  VariantProps<typeof folderTriggerVariants>

const Folder = forwardRef<
  HTMLDivElement,
  FolderProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      className,
      element,
      value,
      isSelectable = true,
      isSelect,
      children,
      ...props
    },
    ref
  ) => {
    const {
      direction,
      handleExpand,
      expandedItems,
      indicator,
      selectedId,
      selectItem,
      openIcon,
      closeIcon,
    } = useTree()
    const isSelected = isSelect ?? selectedId === value

    return (
      <AccordionPrimitive.Item
        ref={ref}
        {...props}
        value={value}
        className="relative h-full overflow-hidden"
      >
        <AccordionPrimitive.Trigger
          className={cn(
            folderTriggerVariants({ isSelectable, isSelected }),
            className
          )}
          disabled={!isSelectable}
          onClick={() => {
            selectItem(value)
            handleExpand(value)
          }}
        >
          {expandedItems?.includes(value)
            ? (openIcon ?? <FolderOpenIcon className="size-3.5 text-[var(--primary)]" />)
            : (closeIcon ?? <FolderIcon className="size-3.5 opacity-60" />)}
          <span className="truncate">{element}</span>
        </AccordionPrimitive.Trigger>
        <AccordionPrimitive.Content className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down relative h-full overflow-hidden text-sm">
          {element && indicator && <TreeIndicator aria-hidden="true" />}
          <AccordionPrimitive.Root
            dir={direction}
            type="multiple"
            className="ml-6 flex flex-col gap-0.5 py-1 rtl:mr-6"
            value={expandedItems}
          >
            {children}
          </AccordionPrimitive.Root>
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
    )
  }
)

Folder.displayName = "Folder"

const File = forwardRef<
  HTMLButtonElement,
  {
    value: string
    handleSelect?: (id: string) => void
    isSelectable?: boolean
    isSelect?: boolean
    fileIcon?: React.ReactNode
  } & React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof fileVariants>
>(
  (
    {
      value,
      className,
      handleSelect,
      onClick,
      isSelectable = true,
      isSelect,
      fileIcon,
      children,
      ...props
    },
    ref
  ) => {
    const { direction, selectedId, selectItem } = useTree()
    const isSelected = isSelect ?? selectedId === value
    return (
      <button
        ref={ref}
        type="button"
        disabled={!isSelectable}
        className={cn(
          fileVariants({ isSelectable, isSelected, direction }),
          className
        )}
        onClick={(event) => {
          selectItem(value)
          handleSelect?.(value)
          onClick?.(event)
        }}
        {...props}
      >
        {fileIcon ?? <FileIcon className="size-3.5 opacity-60" />}
        {children}
      </button>
    )
  }
)

File.displayName = "File"

const CollapseButton = forwardRef<
  HTMLButtonElement,
  {
    elements: TreeViewElement[]
    expandAll?: boolean
  } & React.HTMLAttributes<HTMLButtonElement>
>(({ className, elements, expandAll = false, children, ...props }, ref) => {
  const { expandedItems, setExpandedItems } = useTree()

  const expendAllTree = useCallback((elements: TreeViewElement[]) => {
    const expandedElementIds: string[] = []

    const expandTree = (element: TreeViewElement) => {
      const isSelectable = element.isSelectable ?? true
      if (isSelectable && element.children && element.children.length > 0) {
        expandedElementIds.push(element.id)
        for (const child of element.children) {
          expandTree(child)
        }
      }
    }

    for (const element of elements) {
      expandTree(element)
    }

    return [...new Set(expandedElementIds)]
  }, [])

  const closeAll = useCallback(() => {
    setExpandedItems?.([])
  }, [setExpandedItems])

  useEffect(() => {
    if (expandAll) {
      setExpandedItems?.(expendAllTree(elements))
    }
  }, [expandAll, elements, expendAllTree, setExpandedItems])

  return (
    <Button
      variant={"ghost"}
      className={cn("absolute right-2 bottom-1 h-8 w-fit p-1", className)}
      onClick={
        expandedItems && expandedItems.length > 0
          ? closeAll
          : () => setExpandedItems?.(expendAllTree(elements))
      }
      ref={ref}
      {...props}
    >
      {children}
      <span className="sr-only">Toggle</span>
    </Button>
  )
})

CollapseButton.displayName = "CollapseButton"

const FileTree = () => {
  const elements: TreeViewElement[] = [
    {
      id: "src",
      name: "src",
      type: "folder",
      children: [
        {
          id: "app",
          name: "app",
          type: "folder",
          children: [
            {
              id: "landing-group",
              name: "(landing)",
              type: "folder",
              children: [
                { id: "landing-layout", name: "layout.tsx", type: "file" },
                { id: "landing-page", name: "page.tsx", type: "file" },
              ]
            },
            {
              id: "docs-group",
              name: "docs",
              type: "folder",
              children: [
                {
                  id: "slug-group",
                  name: "[...slug]",
                  type: "folder",
                  children: [
                    { id: "slug-page", name: "page.tsx", type: "file" }
                  ]
                },
                { id: "docs-layout", name: "layout.tsx", type: "file" },
                { id: "docs-page", name: "page.tsx", type: "file" }
              ]
            },
            { id: "globals-css", name: "globals.css", type: "file" },
            { id: "root-layout", name: "layout.tsx", type: "file" }
          ]
        },
        {
          id: "components",
          name: "components",
          type: "folder",
          children: [
            {
              id: "comp-docs",
              name: "docs",
              type: "folder",
              children: [
                { id: "docs-sidebar", name: "DocsSidebar.tsx", type: "file" },
                { id: "docs-breadcrumb", name: "DocsBreadcrumb.tsx", type: "file" }
              ]
            },
            {
              id: "comp-ui",
              name: "ui",
              type: "folder",
              children: [
                { id: "ui-footer", name: "Footer.tsx", type: "file" },
                { id: "ui-grainient", name: "grainient.tsx", type: "file" }
              ]
            }
          ]
        }
      ]
    },
    { id: "gwen-json", name: "gwen.json", type: "file" },
    { id: "tailwind-config", name: "tailwind.config.ts", type: "file" }
  ];

  return (
    <div className="w-[300px] h-[360px] rounded-xl border border-white/5 bg-white/[0.01] p-4 flex flex-col justify-start">
      <div className="text-[11px] font-mono text-[var(--docs-text-faint)] uppercase tracking-wider mb-3 px-2 flex items-center justify-between">
        <span>Workspace Consolidated</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      </div>
      <Tree elements={elements} initialExpandedItems={["src", "app", "components"]} />
    </div>
  );
};

export { CollapseButton, File, Folder, Tree, FileTree, type TreeViewElement }
export type { TreeSortMode }
