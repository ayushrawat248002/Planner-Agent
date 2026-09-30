'use client';


import React, { useEffect, useLayoutEffect, useMemo, useCallback, useRef, useState } from "react";
import UserForm from "./form";
import { json } from "stream/consumers";
import { clearInterval } from "timers";





const HotelFormCard = React.memo( ({data }: any) => {
  const args  = data;
       console.log(args,'adsa line 613')
  const [location, setLocation] = useState(args?.location ?? "");
  const [checkInDate, setCheckInDate] = useState(args?.checkIn ?? "");
  const [checkOutDate, setCheckOutDate] = useState(args?.checkOut ?? "");
  const [days, setDays] = useState(args?.days ?? "");
  const [totalrooms, setTotalrooms] = useState(args?.totalrooms ?? 1);


  return (
    <div className="lg:w-full scale-65 max-w-4xl min-w-[400px] rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">

      {/* Hotel Information */}
      <div className="mb-5 min-w-0">

        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-gray-900">
            Hotel Details
          </h2>

          <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
            Hotel
          </span>
        </div>

        <div className="rounded-xl border border-gray-200 p-3 sm:p-4">

          {/* Location */}
          <div className="mb-4">
            <p className="text-xs text-gray-500">
              Location
            </p>

            <p className="mt-1 truncate text-lg font-semibold text-gray-900">
              {location || "Hotel location"}
            </p>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <p className="text-xs text-gray-500">
                Check-in
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {checkInDate || "--"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Check-out
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {checkOutDate || "--"}
              </p>
            </div>

          </div>

        </div>
      </div>


      {/* Location */}
      <div className="mb-4 min-w-0 text-black">

        <label className="mb-2 block text-sm font-medium text-gray-700">
          Hotel / Location
        </label>

        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter hotel or location"
          className="w-full min-w-0 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-400"
        />

      </div>


      {/* Dates */}
      <div className="mb-4 grid grid-cols-2 gap-3 text-black">

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Check-in
          </label>

          <input
            type="text"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            placeholder="e.g. 10 October"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Check-out
          </label>

          <input
            type="text"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            placeholder="e.g. 12 October"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-400"
          />
        </div>

      </div>


      {/* Number of Days */}
      <div className="mb-4 min-w-0 text-black">

        <label className="mb-2 block text-sm font-medium text-gray-700">
          Number of Days
        </label>

        <input
          type="number"
          min={1}
          value={days}
          onChange={(e) => setDays(e.target.value)}
          placeholder="Enter number of days"
          className="w-full min-w-0 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-400"
        />

      </div>


      {/* Rooms */}
      <div className="mb-4 min-w-0 text-black">

        <label className="mb-2 block text-sm font-medium text-gray-700">
          Number of Rooms
        </label>

        <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3">

          <span className="text-sm text-gray-700">
            Rooms
          </span>

          <div className="flex items-center gap-3">

            <button
              type="button"
              disabled={totalrooms <= 1}
              onClick={() =>
                setTotalrooms((prev: number) => Math.max(1, prev - 1))
              }
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-lg transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              −
            </button>

            <span className="w-5 text-center font-semibold">
              {totalrooms}
            </span>

            <button
              type="button"
              onClick={() =>
                setTotalrooms((prev: number) => prev + 1)
              }
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-lg transition hover:bg-gray-100"
            >
              +
            </button>

          </div>

        </div>

      </div>


      {/* Maximum Price */}
      <div className="mb-5 min-w-0 text-black">

        

       

      </div>


      {/* Continue */}
      <button
        type="button"
        className="w-full rounded-xl bg-black py-3 text-sm font-medium text-white transition hover:bg-gray-800 active:scale-[0.98] sm:text-base"
      >
        Continue with {totalrooms} room
        {totalrooms !== 1 ? "s" : ""}
      </button>

    </div>
  );
})

const FlightCard = React.memo(({data,flightcardCallbackRef, flightcardArgscallback }: any) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const slider = sliderRef.current;
    if (!slider) return;

    isDragging.current = true;

    startX.current = e.clientX;
    startScrollLeft.current = slider.scrollLeft;

    slider.style.cursor = "grabbing";
    slider.style.scrollBehavior = "auto";

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;

      e.preventDefault();

      const diff = e.clientX - startX.current;

      slider.scrollLeft = startScrollLeft.current - diff;
    };

    const handleMouseUp = () => {
      isDragging.current = false;

      slider.style.cursor = "grab";

      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };


  return (
       <div
      ref={sliderRef}
      
      onMouseDown={handleMouseDown}
      className="
        relative
        flex
        h-[400px]
        w-[100vw]
        min-w-0
        flex-row
        gap-6
        overflow-x-auto
        overflow-y-hidden
        px-7
        py-5
        cursor-grab
        select-none
        scrollbar-hide
      "
    >

      {data?.result?.map((item: any, index: number) => {
        const departure = item.departureTime?.split("T") || [];
        const arrival = item.arrivalTime?.split("T") || [];
               

        return (
         
              <div
            key={index}
             ref={(el) => {
           flightcardCallbackRef(index, el)
    }}
            className="
              group
              h-full
              w-[300px]
              min-w-[300px]
              shrink-0
              opacity-0
              overflow-hidden
              rounded-3xl
              border
              border-gray-200
              bg-white
              text-black
              shadow-sm
              transition-opacity
              duration-300
                ease-in-out
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            {/* Top */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-lg font-bold text-blue-600">
                  ✈
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Airline
                  </p>

                  <h2 className="font-semibold text-gray-900">
                    {item.airline}
                  </h2>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-400">
                  Price
                </p>

                <p className="text-xl font-bold text-gray-900">
                  ₹{item.price}
                </p>
              </div>
            </div>

            {/* Route */}
            <div className="px-6 py-6">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {departure[1]?.slice(0, 5)}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {departure[0]}
                  </p>
                </div>

                <div className="mx-4 flex flex-1 items-center">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />

                  <div className="relative mx-2 h-px flex-1 bg-gray-300">
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-2 text-lg text-blue-500">
                      ✈
                    </span>
                  </div>

                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    {arrival[1]?.slice(0, 5)}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {arrival[0]}
                  </p>
                </div>

              </div>
            </div>

            {/* Details */}
            <div className="mx-6 rounded-2xl bg-gray-50 p-4">
              <div className="grid grid-cols-2 gap-4">

                <div>
                  <p className="text-xs text-gray-400">
                    Departure
                  </p>

                  <p className="mt-1 font-medium text-gray-700">
                    {departure[1]?.slice(0, 5)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Arrival
                  </p>

                  <p className="mt-1 font-medium text-gray-700">
                    {arrival[1]?.slice(0, 5)}
                  </p>
                </div>

              </div>
            </div>

            {/* Bottom */}
            <div className="mt-4 flex items-center justify-between px-6">

              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                Available
              </span>

              <button
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => {flightcardArgscallback({ Information : item, args : data.args})  }}
                className="
                  rounded-xl
                  bg-blue-600
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-blue-700
                  active:scale-95
                "
              >
                Select Flight
              </button>

            </div>
          </div>
        );
      })}
    </div>
  );
  
});

  
const HotelCard =  React.memo( ({ data,hotelcardCallbackRef, hotelcardArgscallback }: any) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;

    isDragging.current = true;
    startX.current = e.clientX;
    startScrollLeft.current = sliderRef.current.scrollLeft;

    sliderRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !sliderRef.current) return;

    e.preventDefault();

    const diff = e.clientX - startX.current;

    sliderRef.current.scrollLeft =
      startScrollLeft.current - diff;
  };

  const handleMouseUp = () => {
    isDragging.current = false;

    if (sliderRef.current) {
      sliderRef.current.style.cursor = "grab";
    }
  };

  const handleMouseLeave = () => {
    isDragging.current = false;

    if (sliderRef.current) {
      sliderRef.current.style.cursor = "grab";
    }
  };

  return (
    <div
      ref={sliderRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      className="
        relative
        flex
        h-[400px]
        w-[95vw]
        flex-row
        gap-6
        overflow-x-scroll
        overflow-y-hidden
        px-7
        py-5
        select-none
        cursor-grab
        scrollbar-hide
      "
    >
      {data?.result?.map((item: any, index: number) => {
      
        return (
          <div
            key={index}
            ref = {(el : any) => hotelcardCallbackRef(index, el)}
            className="
              group
              h-full
              w-[300px]
              shrink-0
              overflow-hidden
              opacity-0
              rounded-3xl
              border
              border-gray-200
              bg-white
              text-black
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            {/* Top */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-xl">
                  🏨
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Hotel
                  </p>

                  <h2 className="font-semibold text-gray-900">
                    {item.name}
                  </h2>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-400">
                  Rating
                </p>

                <p className="text-xl font-bold text-gray-900">
                  ⭐ {item.rating}
                </p>
              </div>
            </div>

            {/* Hotel Info */}
            <div className="px-6 py-6">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Price per night
              </p>

              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-900">
                  ₹{item.pricePerNight}
                </p>

                <span className="text-sm text-gray-500">
                  / night
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="mx-6 rounded-2xl bg-gray-50 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400">
                    Rating
                  </p>

                  <p className="mt-1 font-medium text-gray-700">
                    ⭐ {item.rating}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Stay
                  </p>

                  <p className="mt-1 font-medium text-gray-700">
                    Per Night
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div className="mt-4 flex items-center justify-between px-6">
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                Available
              </span>

              <button
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => {if(data.args){ hotelcardArgscallback(data.args)} }}
                className="
                  rounded-xl
                  bg-blue-600
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-blue-700
                  active:scale-95
                "
              >
                Select Hotel
              </button>
            </div>
          </div>
        );
       
      })}
    </div>
  );
});

 const FormCard =  React.memo( function FormCard({ data }: any) {
  const { Information, args } = data;

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabin, setCabin] = useState("Economy");
  const [directOnly, setDirectOnly] = useState(false);

  const totalPassengers = adults + children + infants;

  const updateCount = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: number,
    min = 0
  ) => {
    setter((prev) => Math.max(min, prev + value));
  };

  const formatTime = (date: string) => {
    if (!date) return "--";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date: string) => {
    if (!date) return "--";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    
<div className="lg:w-full  scale-65 max-w-4xl min-w-[400px] rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">

  {/* Flight Information */}
  <div className="mb-5 min-w-0">
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-lg font-semibold text-gray-900">
        Flight Details
      </h2>

      <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
        {Information?.direct
          ? "Direct"
          : `${Information?.stops ?? 0} Stop`}
      </span>
    </div>

    <div className="min-w-0 rounded-xl border border-gray-200 p-3 sm:p-4">

      {/* Airline + Price */}
      <div className="mb-4 flex min-w-0 flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-gray-900">
            {Information?.airline || "Airline"}
          </p>

          <p className="text-xs text-gray-500">
            {Information?.direct
              ? "Non-stop flight"
              : "Connecting flight"}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-lg font-bold text-gray-900">
            ₹{Information?.price?.toLocaleString("en-IN")}
          </p>

          <p className="text-xs text-gray-500">
            per passenger
          </p>
        </div>
      </div>

      {/* Route */}
      <div className="flex min-w-0 items-center justify-between gap-2">

        {/* Departure */}
        <div className="min-w-0 shrink-0">
          <p className="truncate text-xl font-bold text-gray-900 sm:text-2xl">
            {Information?.departure}
          </p>

          <p className="text-sm text-gray-500">
            {formatTime(Information?.departureTime)}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {formatDate(Information?.departureTime)}
          </p>
        </div>

        {/* Flight Line */}
        <div className="flex min-w-[40px] flex-1 items-center px-1 sm:px-4">
          <div className="h-px flex-1 bg-gray-300" />

          <div className="mx-1 text-xs text-gray-400 sm:mx-2">
            ✈
          </div>

          <div className="h-px flex-1 bg-gray-300" />
        </div>

        {/* Arrival */}
        <div className="min-w-0 shrink-0 text-right">
          <p className="truncate text-xl font-bold text-gray-900 sm:text-2xl">
            {Information?.arrival}
          </p>

          <p className="text-sm text-gray-500">
            {formatTime(Information?.arrivalTime)}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {formatDate(Information?.arrivalTime)}
          </p>
        </div>

      </div>
    </div>
  </div>


  {/* Passenger Selection */}
  <div className="mb-5 min-w-0">

    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-lg font-semibold text-gray-900">
        Passengers
      </h2>

      <span className="text-sm text-gray-500">
        {totalPassengers} passenger
        {totalPassengers !== 1 ? "s" : ""}
      </span>
    </div>

    <div className="overflow-hidden rounded-xl border border-gray-200">

      {/* Adults */}
      <div className="flex min-w-0 items-center justify-between gap-3 border-b border-gray-200 px-3 py-4 sm:px-4">

        <div className="min-w-0">
          <p className="font-medium text-gray-900">
            Adults
          </p>

          <p className="text-xs text-gray-500">
            12+ years
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3 text-black">
          <button
            type="button"
            disabled={adults <= 1}
            onClick={() => updateCount(setAdults, -1, 1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-lg transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            −
          </button>

          <span className="w-5 text-center font-semibold">
            {adults}
          </span>

          <button
            type="button"
            onClick={() => updateCount(setAdults, 1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-lg transition hover:bg-gray-100"
          >
            +
          </button>
        </div>

      </div>


      {/* Children */}
      <div className="flex min-w-0 items-center justify-between gap-3 border-b border-gray-200 px-3 py-4 sm:px-4">

        <div className="min-w-0">
          <p className="font-medium text-gray-900">
            Children
          </p>

          <p className="text-xs text-gray-500">
            2–11 years
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3 text-black">

          <button
            type="button"
            disabled={children <= 0}
            onClick={() => updateCount(setChildren, -1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-lg transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            −
          </button>

          <span className="w-5 text-center font-semibold">
            {children}
          </span>

          <button
            type="button"
            onClick={() => updateCount(setChildren, 1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-lg transition hover:bg-gray-100"
          >
            +
          </button>

        </div>

      </div>


      {/* Infants */}
      <div className="flex min-w-0 items-center justify-between gap-3 px-3 py-4 sm:px-4">

        <div className="min-w-0">
          <p className="font-medium text-gray-900">
            Infants
          </p>

          <p className="text-xs text-gray-500">
            Under 2 years
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3 text-black">

          <button
            type="button"
            disabled={infants <= 0}
            onClick={() => updateCount(setInfants, -1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-lg transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            −
          </button>

          <span className="w-5 text-center font-semibold">
            {infants}
          </span>

          <button
            type="button"
            onClick={() => updateCount(setInfants, 1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-lg transition hover:bg-gray-100"
          >
            +
          </button>

        </div>

      </div>

    </div>
  </div>


  {/* Cabin Class */}
  <div className="mb-4 min-w-0 text-black">

    <label className="mb-2 block text-sm font-medium text-gray-700">
      Cabin Class
    </label>

    <select
      value={cabin}
      onChange={(e) => setCabin(e.target.value)}
      className="w-full min-w-0 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-400"
    >
      <option>Economy</option>
      <option>Premium Economy</option>
      <option>Business</option>
      <option>First Class</option>
    </select>

  </div>


  {/* Direct Flight */}
  <div className="mb-5 flex min-w-0 items-center justify-between gap-4 rounded-xl border border-gray-200 px-3 py-3 sm:px-4">

    <div className="min-w-0">
      <p className="text-sm font-medium text-gray-900">
        Direct flights only
      </p>

      <p className="text-xs text-gray-500">
        Avoid flights with stops
      </p>
    </div>

    <button
      type="button"
      onClick={() => setDirectOnly((prev) => !prev)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        directOnly ? "bg-black" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
          directOnly ? "left-6" : "left-1"
        }`}
      />
    </button>

  </div>


  {/* Continue */}
  <button
    type="button"
    className="w-full rounded-xl bg-black py-3 text-sm font-medium text-white transition hover:bg-gray-800 active:scale-[0.98] sm:text-base"
  >
    Continue with {totalPassengers} passenger
    {totalPassengers !== 1 ? "s" : ""}
  </button>

</div>


  );
})





export default function Chatscreen() {

  const [messages, setMessages] = useState<any[]>([]);
  const [value, setValue] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [flightargs, setflightargs] = useState({})
  const [hotelargs, sethotelargs] = useState<any>({})
   const [displayForm, setFormdisplay] = useState(false);
   const[typeform, setTypeform] = useState('login')
     const [flightdata, setflight] = useState<any>({} );
     const [hoteldata, sethotel] = useState<any>({} )
      const [historyIndexArr, setHistoryindexArr] = useState<any>([]);
      const [selectedHistoryIndex, setselectedHistoryIndex] = useState<any>(null);
      const TimerRef = useRef<any>(null);
  const oldMessageLength = useRef<any>(0);
   const refArr = useRef<any>([]);
   const historyIndexRef = useRef<any>(null)
   const hotelref = useRef<any>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
   const [showflight, setshowflight] = useState(false);
    const [showhotel, setshowhotel] = useState(false); 
  const controllerRef = useRef<AbortController | null>(null);
  const cancelStream = useRef(false);
  const messagesRef = useRef<any>([]);
   const currentHistoryLength = useRef<any>(null);
   const [chunkIndex, setchunkIndex] = useState(1);
   const uploadingRef = useRef<any>(false);
   const scrollToposition = useRef<any>(true);
   const haslocaldataLoaded = useRef(false);
   const historyBarRef = useRef<any>(null);
   const [ historyBar, sethistoryBar] = useState<any>(false)
 

const testData: any = {
  1: [
    {
      role: "assistant",
      content: "Hello! How can I help you?",
      conversationType: "text"
    },
    {
      role: "user",
      content: "Find me a flight from Delhi to Mumbai",
      conversationType: "text"
    },
    {
      role: "assistant",
      content: "Sure, I can help you find flights from Delhi to Mumbai.",
      conversationType: "text"
    },
    {
      role: "user",
      content: "I want to travel on 23 December",
      conversationType: "text"
    },
    {
      role: "assistant",
      content: "Got it. Your travel date is 23 December.",
      conversationType: "text"
    },
    {
      role: "user",
      content: "Show me direct flights only",
      conversationType: "text"
    },
    {
      role: "assistant",
      content: "Here are the available direct flights.",
      conversationType: "text"
    },
    {
      role: "user",
      content: "What is the cheapest option?",
      conversationType: "text"
    },
    {
      role: "assistant",
      content: "The cheapest direct flight is ₹4500.",
      conversationType: "text"
    },
    {
      role: "user",
      content: "Book that flight",
      conversationType: "text"
    }
  ],

  2: [
    {
      role: "assistant",
      content: "Here are some hotels in Mumbai.",
      conversationType: "text"
    },
    {
      role: "user",
      content: "Show me hotels under ₹5000",
      conversationType: "text"
    },
    {
      role: "assistant",
      content: "I found several hotels under ₹5000 per night.",
      conversationType: "text"
    },
    {
      role: "user",
      content: "I need a hotel for two people",
      conversationType: "text"
    },
    {
      role: "assistant",
      content: "How many nights will you be staying?",
      conversationType: "text"
    },
    {
      role: "user",
      content: "I will stay for three nights",
      conversationType: "text"
    },
    {
      role: "assistant",
      content: "Here are hotels available for three nights.",
      conversationType: "text"
    },
    {
      role: "user",
      content: "Show hotels near the airport",
      conversationType: "text"
    },
    {
      role: "assistant",
      content: "I found hotels near Mumbai airport.",
      conversationType: "text"
    },
    {
      role: "user",
      content: "Show me the cheapest one",
      conversationType: "text"
    }
  ],

  3: [
    {
      role: "assistant",
      content: "Your trip plan is ready.",
      conversationType: "text"
    },
    {
      role: "user",
      content: "Plan a 3 day Mumbai trip",
      conversationType: "text"
    },
    {
      role: "assistant",
      content: "What is your approximate budget?",
      conversationType: "text"
    },
    {
      role: "user",
      content: "My budget is ₹15000",
      conversationType: "text"
    },
    {
      role: "assistant",
      content: "What kind of activities do you prefer?",
      conversationType: "text"
    },
    {
      role: "user",
      content: "I like sightseeing and food",
      conversationType: "text"
    },
    {
      role: "assistant",
      content: "I will include sightseeing and local food experiences.",
      conversationType: "text"
    },
    {
      role: "user",
      content: "Also include some beaches",
      conversationType: "text"
    },
    {
      role: "assistant",
      content: "I have added beaches to your itinerary.",
      conversationType: "text"
    },
    {
      role: "user",
      content: "Show me the final plan",
      conversationType: "text"
    }
  ],

  4: [
    {
      role: "assistant",
      content: "I found some direct flights.",
      conversationType: "text"
    },
    {
      role: "user",
      content: "Only show direct flights",
      conversationType: "text"
    },
    {
      role: "assistant",
      content: "Here are the available nonstop flights.",
      conversationType: "text"
    },
    {
      role: "user",
      content: "What time does the first flight depart?",
      conversationType: "text"
    },
    {
      role: "assistant",
      content: "The first flight departs at 6:30 AM.",
      conversationType: "text"
    },
    {
      role: "user",
      content: "How much does it cost?",
      conversationType: "text"
    },
    {
      role: "assistant",
      content: "The ticket costs ₹5200.",
      conversationType: "text"
    },
    {
      role: "user",
      content: "Are there any cheaper direct flights?",
      conversationType: "text"
    },
    {
      role: "assistant",
      content: "Yes, there is another direct flight for ₹4800.",
      conversationType: "text"
    },
    {
      role: "user",
      content: "Show me that flight",
      conversationType: "text"
    }
  ]
};
  const callback = useCallback((text: string) => {
  setTypeform(text);
}, []);

 const hotelcardCallbackRef = useCallback((index : any,el : any) => {
              hotelref.current[index] = el;
                       
 },[])
  const flightcardCallbackRef = useCallback((index : any,el : any) => {
              refArr.current[index] = el;
                       
 },[])

 const hotelcardArgscallback = useCallback((data : any) => {
             sethotelargs(data);
             setshowhotel(true)
 },[])
  const flightcardArgscallback = useCallback((data : any) => {
             setflightargs(data);
             setshowflight(true)
 },[])


useLayoutEffect(() => {
  let cancelled = false;
       let val = 20
  const showCards = async () => {
    for (const el of refArr.current) {
      if (!el) continue;
             const time = val + 300;
      await new Promise((resolve) => setTimeout(resolve, time));
        val+=30

      if (cancelled) return;

      el.style.opacity = "100";
    }
  };

  showCards();

  return () => {
    cancelled = true;
  };
}, [flightdata]);

useLayoutEffect(() => {
  let cancelled = false;
       let val = 20
  const showCards = async () => {
    for (const el of hotelref.current) {
      if (!el) continue;
             const time = val + 300;
      await new Promise((resolve) => setTimeout(resolve, time));
        val+=30

      if (cancelled) return;

      el.style.opacity = "100";
    }
  };

  showCards();

  return () => {
    cancelled = true;
  };
}, [hoteldata]);



 useEffect(() => {
            const ishistory =  localStorage.getItem('localdata') ?? false;
                    console.log(ishistory, 'ishistory')
         
                     

                   const Load = async() => {
                         const response =   await fetch(`/api/chatHistory`,{
                                     method:'POST',
                                      headers : {
                                      'x-historyIndex' : '',
                                      'x-type' : 'getIndex',
                                      'x-chunkIndex' :  ``
                                     },
                                     body : null
                                   });
                                   
                               const redishistoryIndexes : any = await response.json();
                              
                               console.log(redishistoryIndexes.data, 'data redis arr line 1311')
                                     if(!redishistoryIndexes.data)return;
                                     setHistoryindexArr(redishistoryIndexes.data)                      
                   }

                 Load()

                  
            
                   if(ishistory){
                            
                   const parsedhistory = JSON.parse(ishistory);
                  
                   setMessages((prev) => [...prev,...parsedhistory]);
             }

            const checkInterval = async () => {
  if (uploadingRef.current) return;

  if (messagesRef.current.length >= 10) {
    uploadingRef.current = true;

    try {
      const pendingMessages = [...messagesRef.current];

      const response = await fetch("/api/chatHistory", {
        method: "POST",
        headers: {
          "x-historyIndex": historyIndexRef.current,
          "x-type": "create",
        },
        body: JSON.stringify(pendingMessages),
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }
         localStorage.removeItem('localdata');
         localStorage.removeItem(historyIndexRef.current);
         
      oldMessageLength.current += pendingMessages.length;
      messagesRef.current = [];

      await response.json();
    } finally {
      uploadingRef.current = false;
    }
  }
};
             TimerRef.current = setInterval(checkInterval, 1000 * 30);

            return () => {clearInterval(TimerRef.current); oldMessageLength.current = 0; currentHistoryLength.current = 0;messagesRef.current = [] }
 },[]);

 useEffect(() => {
        
          const loadmessages = async() => {
               if(!selectedHistoryIndex)return;
                       localStorage.removeItem('localdata');
              
                         console.log('hiting')
                         try{
                 const response =  await fetch(`/api/chatHistory`,{
                                     method:'POST',
                                     headers : {
                                      'x-historyIndex' : selectedHistoryIndex ?? '',
                                      'x-type' : 'get',
                                      'x-chunkIndex' :  `chunk${chunkIndex}`
                                     },
                                     body : null
                                   })

                                   let localdata = null;

                                       if(!haslocaldataLoaded.current){
                                     localdata = localStorage.getItem(historyIndexRef.current) ?? null ;
                                       
                                              if(localdata)haslocaldataLoaded.current = true
                                       }

                                   const result = await response.json();
                                            if(result.indexLength){
                                               currentHistoryLength.current = result.indexLength
                                            }
                                     console.log(result, 'result line1422')
                                       if(!result.messageArr)return;
                                        oldMessageLength.current += result.messageArr.length
                                                
                                          localdata ? setMessages((prev) => [...result.messageArr,...prev,...JSON.parse(localdata)]) : setMessages( (prev) => [...result.messageArr,...prev]) 
               
                                    }catch(err : any){

                                    }

                                  }
                  loadmessages()
              }, [chunkIndex, selectedHistoryIndex])


useEffect(() => {
     
   if(messages.length > 0){
    console.log(oldMessageLength.current,messages, 'messagelength')
           if(oldMessageLength.current > 0){
                   messagesRef.current = [...messages].slice(oldMessageLength.current, messages.length)
           }
    else{
        
  messagesRef.current = [...messages];
    }

     console.log(messagesRef.current, 'messagescurrent')
    if(messagesRef.current.length > 0){
          if(historyIndexRef.current && selectedHistoryIndex){
              localStorage.setItem(historyIndexRef.current, JSON.stringify(messagesRef.current))
          }else{
      localStorage.setItem(
    "localdata",
    JSON.stringify(messagesRef.current)
 
  );
}

}
}

}, [messages]);

useEffect(() => {
  const saveLocalHistory = () => {
    if(!messagesRef.current || messagesRef.current.length === 0)return
  
    // localStorage.setItem(
    //   "localdata",
    //   JSON.stringify(messagesRef.current)
    // );
  };

  window.addEventListener("pagehide", saveLocalHistory);

  return () => {
    window.removeEventListener("pagehide", saveLocalHistory);
  };
}, []);

 

  useEffect(() => {
     if(!scrollToposition.current)return; 
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, output]);

  const stream = async (queue: any) => {
    let text = "";
              
             

         
            
    for (const chunk of queue) {
      if (cancelStream.current) throw new Error("cancelled");

           if(typeof chunk === 'string'){
                setOutput((prev) => prev+=` ${chunk}`);
                text+= ` ${chunk}`;
                   await new Promise((r) => setTimeout(r, 80));
                continue;
           }


           const task = chunk?.task;
           const data = chunk?.answer;
                
                   if(task === 'search_flights' || task === 'search_hotels'){
                             if(task === 'search_flights'){
                                     setflight(data)
                             }  else{
                                sethotel(data)
                             }
                             continue;
                   }
                  
              const splitted = data.result ? chunk.answer.result.split(' ') : data.split(' ');
              if(Array.isArray(splitted)){    
              for(const word of splitted){
                         setOutput((prev) => prev.concat(` ${word}`));
                         text+=` ${word}`;
                            await new Promise((r) => setTimeout(r, 80));
                  }
                }

            

      await new Promise((r) => setTimeout(r, 80));
    }

    return text;
  };

  const handleSend = async () => {
    if (!value.trim() || loading) return;
         
    cancelStream.current = false;
    setLoading(true);
    setOutput("");

    const userMessage: any = {
      role: "user",
      content: value,
    };
     scrollToposition.current = true;

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setValue("");

    const controller = new AbortController();
    controllerRef.current = controller;
     const index = historyIndexRef.current ?? crypto.randomUUID();
     historyIndexRef.current = index;

   
    try {
      const res = await fetch("/api/ai/proxy", {
        method: "POST",
        headers:{
            'x-chatid' : index
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
        signal: controller.signal,
      });

      const data : any = await res.json();
      console.log(data.status, 'dadasc')
           if ( data.status && ![200, 201].includes(data.status)) {
              setFormdisplay(true);
                  throw new Error()
}
           setLoading(false);

      const finalText = await stream(data);
         if(finalText){
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: finalText,
        },
      ]);
    }
    
   setOutput('')

    } catch (err : any) {
         setLoading(false);
         console.log(err, 'eroorer')
       
    }


  };

useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  console.log(displayForm);
}, [displayForm]);

  const stopGeneration = () => {
    cancelStream.current = true;
    controllerRef.current?.abort();
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };
  const changeDisplay = useCallback(() => {
  setFormdisplay(false);
}, []);

useLayoutEffect(() => {
  console.log("hit bar");

  if (!historyBarRef.current) return;

  if (historyBar) {
    historyBarRef.current.style.translate = "0";
  } else {
    historyBarRef.current.style.translate = "-100px";
  }
}, [historyBar]);


  return (
    <main
  className={`relative h-dvh w-screen overflow-hidden bg-slate-950 text-white flex flex-col`}
>
  {/* Header */}
  <header
    className={`${
      displayForm ? "blur-[90px]" : "blur-none"
    } shrink-0 border-b border-slate-800 px-6 py-4`}
  >
    <h1 className="text-2xl font-bold">
      ✈️ Travel Planner AI
    </h1>

    <p className="text-slate-400 text-sm">
      Flights • Hotels • Itineraries • General Assistant
    </p>
  </header>

  {/* Form */}
  <div
    className={`absolute ${
      displayForm ? "z-50" : "-z-20"
    }`}
  >
    <UserForm
      callback={callback}
      changedisplay={changeDisplay}
      typePage={typeform}
    />
  </div>

  {/* MAIN CONTENT */}
  <div
    className={`${
      displayForm ? "blur-[90px]" : "blur-none"
    } flex flex-1 min-h-0`}
  >
    {/* Sidebar */}
         <div className="w-1/5">
    <div
    ref={historyBarRef}
    
      className={` absolute -translate-x-25  ${!historyBar ? '' : 'z-10'} bg-black  w-25 h-full shrink-0 overflow-y-auto overflow-x-hidden border-r-2 border-white transition-all duration-500  ${
        !showflight && !showhotel
          ? "opacity-100"
          : "opacity-0"
      }`}
    >
      <ul>
        {[...historyIndexArr]?.map((data: any, index: number) => {
              const modifiedData = data?.split('').includes(' ');
           
                   const newdata = !modifiedData ? data?.split('').splice(0,7).join('').concat(' ').concat('.......') : data?.split(' ').slice(0,3).join(' ').concat(' ').concat('....');
          return (<li
            key={index}
            className={`text-white  ${data === selectedHistoryIndex ? 'bg-red-400 hover:bg-red-400' : ''}  px-3 py-2 border-b hover:bg-blue-600 hover:text-white transition-all duration-300 ease-in-out cursor-pointer select-none border-b-1 border-white`}
           onClick={async() => {
                   if( data === selectedHistoryIndex)return; 
                setMessages([]);
                 oldMessageLength.current = 0;
                 haslocaldataLoaded.current = false;
                 currentHistoryLength.current = 0;
                  historyIndexRef.current = data;
                       setchunkIndex(1);
                           setselectedHistoryIndex(data);
                                  }
                                }>
            {`history ${(historyIndexArr.length - 1) - index}` }
          </li>
        )
      
      })}
      </ul>
     
    </div>
     <button
  className="text-white pl-3 pt-3 text-nowrap hover:text-red-400"
  onClick={() => {
    sethistoryBar(true);
  }}
>
  History -→
</button>
             <div
      onClick={() => sethistoryBar(false)}
      className={`h-6 w-6 bg-white absolute ml-26 top-17  ${!historyBar ? 'hidden' : 'block'} text-bold rounded-full text-black text-center  hover:scale-105 hover:bg-red-600 hover:text-white transition-all duration-250 ease-in-out select-none cursor-pointer`}
    >
      X
    </div>
    </div>

      


    {/* CHAT AREA */}
    <div
      className={`relative  flex-1 min-w-0 min-h-0 flex flex-col transition-opacity duration-500 ${
        !showflight && !showhotel
          ? "opacity-100"
          : "opacity-0"
      }`}
    >
      {/* Suggestions */}
      <div
        className={`shrink-0 px-4 mt-6 flex flex-wrap justify-center gap-3 transition-all duration-500 ${
          messages.length === 0
            ? "block"
            : "hidden pointer-events-none"
        }`}
      >
        {[
          "✈️ Find Flights",
          "🏨 Hotels",
          "🗺️ Plan Trip",
          "💰 Budget Trip",
        ].map((item) => (
          <button
            key={item}
            onClick={() => setValue(item)}
            className="rounded-full border border-slate-700 px-4 py-2 hover:bg-slate-800 transition"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div
            onScroll={() => {
                     const hitzero  = chatRef.current?.scrollTop === 0;
                      if(hitzero){
                        scrollToposition.current = false;
                       setchunkIndex((prev : any) => {
                               if(prev + 1 > currentHistoryLength.current){
                                return prev;
                               }else{
                                 return prev  +1
                               }
                       })
            } }}
         ref={chatRef}
        className="flex-1 min-h-0  overflow-y-auto snap-y snap-mandatory   px-4 py-6 scrollbar-hide"
      >
        <div  className="mx-auto snap-center py-10 max-w-4xl space-y-5">
          {messages.length > 0 &&
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex  ${
                  msg.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%]   rounded-2xl px-4 py-3 whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-blue-600"
                      : "bg-slate-800"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

          {/* Loading */}
          {loading && (
            <div className="h-7 w-fit ml-6 rounded-full bg-blue-700 px-3 animate-pulse">
              waiting for answer
            </div>
          )}

          {/* Streaming output */}
          {output.length > 0 && (
            <div className="flex justify-start">
              <div className="bg-slate-800 rounded-2xl px-4 py-3 max-w-[85%] whitespace-pre-wrap">
                {output}
                <span className="animate-pulse"></span>
              </div>
            </div>
          )}

          {/* Flights */}
          {flightdata?.result?.length > 0 && (
            <FlightCard data={flightdata} flightcardCallbackRef = {flightcardCallbackRef} flightcardArgscallback= {flightcardArgscallback} />
          )}

          {/* Hotels */}
           { hoteldata?.result?.length > 0 && (<HotelCard data={hoteldata} hotelcardCallbackRef = {hotelcardCallbackRef} hotelcardArgscallback = {hotelcardArgscallback}  />)}
        </div>
      </div>
    </div>
  </div>

  {/* INPUT */}
  <div className= "z-20 shrink-0  border-t border-slate-800 bg-slate-900 p-4">
    <div className="mx-auto max-w-4xl">
      <div className="flex items-end gap-3 rounded-2xl border border-slate-700 bg-slate-800 p-3">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={handleChange}
          placeholder="Ask about flights, hotels or anything..."
          className="flex-1 resize-none bg-transparent outline-none max-h-40"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        {loading ? (
          <button
            onClick={stopGeneration}
            className="rounded-lg bg-red-500 px-4 py-2 hover:bg-red-600"
          >
            Stop
          </button>
        ) : (
          <button
            onClick={handleSend}
            className="rounded-lg bg-blue-600 px-4 py-2 hover:bg-blue-700"
          >
            Send
          </button>
        )}
      </div>
    </div>
  </div>

  {/* FLIGHT FORM */}
  <div
    className={`absolute flex w-[30%] left-[40%] top-0 justify-center px-4 transition-opacity duration-500 ${
      showflight
        ? "opacity-100 z-40"
        : "opacity-0 pointer-events-none"
    }`}
  >
    <div
      onClick={() => setshowflight(false)}
      className="h-7 w-7 absolute ml-75 top-23 bg-white rounded-full text-black text-center font-bold hover:scale-105 hover:bg-red-600 hover:text-white transition-all duration-250 ease-in-out select-none cursor-pointer"
    >
      X
    </div>

    <FormCard data={flightargs} />
  </div>

  {/* HOTEL FORM */}
  <div
    className={`absolute flex w-[30%] left-[40%] top-0 justify-center px-4 transition-opacity duration-500 ${
      showhotel
        ? "opacity-100 z-40"
        : "opacity-0 pointer-events-none"
    }`}
  >
    <div
      onClick={() => setshowhotel(false)}
      className="h-7 w-7 absolute ml-75 top-23 bg-white rounded-full text-black text-center font-bold hover:scale-105 hover:bg-red-600 hover:text-white transition-all duration-250 ease-in-out select-none cursor-pointer"
    >
      X
    </div>

    <HotelFormCard data={hotelargs} />
  </div>
</main>
  );
}