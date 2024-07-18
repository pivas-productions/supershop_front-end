'use client'
import { useEffect, useRef, useState, useTransition } from 'react';
import { FaFilter } from 'react-icons/fa';
import { BsGrid, BsGrid1X2 } from "react-icons/bs";
import { Select } from '../ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useForm } from 'react-hook-form';
import FiltersBar from './filters-bar';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const sorting_type = [
    { value: 'by-popularity', label: 'By popularity' },
    { value: 'by-stocks', label: 'The size of the discount' },
    { value: 'in-asc-prices', label: 'By increasing price' },
    { value: 'in-desc-prices', label: 'In descending prices' }
]

const ToolbarCatalog = ({route}) => {
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();
    const [countProducts, setCountProducts] = useState(null);


    const [catalogView, setCatalogView] = useState('list');
    const [filtersView, setFiltersView] = useState(false);
    const [isPending, startTransition] = useTransition();
    const FiltersButton = useRef(null)

    useEffect(() => {
        if (pathname.replace('/catalog', '') != '') {
            // Выполнение запроса fetch на основе выбранной категории
            fetch(`${route}/api/categories${pathname.replace('/catalog', '')}?format=json`, {
                next: { revalidate: 100 } // 3600
            })
                .then(response => response.json())
                .then(data => {
                    setCountProducts(data.item_count)
                })
                .catch(error => {
                    console.error('Error fetching catalog data:', error);
                });
        }
    }, [pathname, route]);

    useEffect(() => {
        if (searchParams.get('view_type')) {
            setCatalogView(searchParams.get('view_type'))
        }
    }, [searchParams]);

    const handleChangeView = (val) => {
        setCatalogView(val)

        const params = new URLSearchParams(searchParams);
    
        if (val != 'list') {
          params.set('view_type', val);
        } else {
          params.delete('view_type');
        }
        replace(`${pathname}?${params.toString()}`);
    }
    
    
    const defValue = {
        sorting_type: sorting_type.find((item) => item.value === 'by-popularity'),
        express_delivery: false
    }
    const form = useForm({
        // resolver: zodResolver(ProfileSchema),
        defaultValues: defValue
    });
    const watchedFields = form.watch();

    const onSubmit = (values) => {
        console.log(values)
        startTransition(() => {
        //     updateuserprofile(values, items.id).then((data) => {
        //         if (data.success) {
        //             setSuccess(data.success);
        //         }
        //         if (data?.error)
        //             setError(data.error);
        //     });
        });
    };

    useEffect(() => {
        // Автоматически отправляем форму при изменении любого поля
        console.log(watchedFields)
        if(watchedFields){
            form.handleSubmit(onSubmit);
        }
    }, [watchedFields, form]);

    const OpenFilters = () => {
        setFiltersView(!filtersView)
    }
    const closedDialog = () => {
        setFiltersView(!filtersView)
    }
    return (
        <>
            <section className="toolbar bg-white">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className=" container mx-auto flex items-center justify-between py-4">
                            <div className="flex items-center space-x-4">
                                <button ref={FiltersButton} onClick={OpenFilters} className="flex items-center space-x-1 text-gray-700">
                                    <FaFilter />
                                    <span>Filters</span>
                                </button>
                                <div className="relative">
                                    <FormField control={form.control} name="sorting_type" render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Select {...field} value={field.value} className="text-sm" disabled={isPending} select_name={"sorting_type"} items={sorting_type} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    {/* Add dropdown for sorting options here */}
                                </div>
                            </div>
                            {pathname.replace('/catalog', '') != '' && <span className="text-gray-700">{countProducts} продуктов</span>}
                            <div className="flex items-center space-x-4">

                                    <FormField control={form.control} name="express_delivery" render={({ field }) => (
                                        <FormItem className='!space-y-0 flex items-center justify-center space-x-2'>
                                            <FormLabel className='!text-base'>Express delivery</FormLabel>
                                            <FormControl>
                                                <input
                                                    type="checkbox"
                                                    {...field}
                                                    value={field.value}
                                                    disabled={isPending}
                                                    className="toggle-checkbox appearance-none w-10 bg-gray-400/20 rounded-full h-6 after:border-black after:rounded-full relative after:border-2 after:h-6 after:w-6 after:block outline-none cursor-pointer transition-all after:transition-all checked:after:border-8 checked:after:translate-x-5"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                <div className="flex items-center space-x-2">
                                    <span>Type of catalog</span>
                                    <button
                                        className={`${catalogView === 'list' ? 'text-black' : 'text-gray-400'
                                            }`}
                                        onClick={() => handleChangeView('list')}
                                    >
                                        <BsGrid1X2 />
                                    </button>
                                    <button
                                        className={`${catalogView === 'grid' ? 'text-black' : 'text-gray-400'
                                            }`}
                                        onClick={() => handleChangeView('grid')}
                                    >
                                        <BsGrid size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </Form>
            </section>
            {filtersView && <FiltersBar ClosedDialog={closedDialog}/>}
        </>
    );
};

export default ToolbarCatalog