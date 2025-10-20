import Image from "next/image";

// Local asset imports
import tablerCheck from "../../assets/tabler_check.svg";
import lucideGoal from "../../assets/lucide_goal.svg";
import iconamoonProfile from "../../assets/iconamoon_profile.svg";
import metersHigh from "../../assets/meters_high.svg";
import metersMed from "../../assets/meters_med.svg";
import metersLow from "../../assets/meters_low.svg";
import tablerTrash from "../../assets/tabler_trash.svg";
import lucideEdit from "../../assets/lucide_edit.svg";
import qlementineReset from "../../assets/qlementine-icons_reset-16.svg";
import materialHome from "../../assets/layout/material-symbols_home-outline-rounded.svg";
import fluentTabs from "../../assets/layout/fluent_tabs-24-regular.svg";
import charmMenuKebab from "../../assets/layout/charm_menu-kebab.svg";
import battery from "../../assets/layout/battery.svg";
import network from "../../assets/layout/network.svg";
import wifi from "../../assets/layout/wifi.svg";

interface NavProps {
  className?: string;
  tab?: "Completed" | "Goals" | "Profile";
}

function Nav({ className, tab = "Completed" }: NavProps) {
  const tablerCheckIcon = (
    <div className="relative shrink-0 size-[24px]" data-name="tabler:check">
      <Image alt="Check icon" className="block max-w-none size-full" src={tablerCheck} width={24} height={24} />
    </div>
  );
  const lucideGoalIcon = (
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="lucide:goal">
      <div className="absolute inset-[8.33%_12.5%_8.34%_12.5%]" data-name="Group">
        <div className="absolute inset-[-5%_-5.56%]">
          <Image alt="Goal icon" className="block max-w-none size-full" src={lucideGoal} width={24} height={24} />
        </div>
      </div>
    </div>
  );
  const profile = (
    <div className="bg-white box-border content-stretch flex gap-[10px] items-center opacity-90 p-[10px] relative rounded-[10px] shrink-0" data-name="profile">
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="iconamoon:profile">
        <div className="absolute inset-[16.667%]" data-name="Group">
          <div className="absolute inset-[-6.25%]">
            <Image alt="Profile icon" className="block max-w-none size-full" src={iconamoonProfile} width={24} height={24} />
          </div>
        </div>
      </div>
    </div>
  );
  if (tab === "Goals") {
    return (
      <div className={className} data-name="Tab=Goals" data-node-id="4:87">
        <div className="bg-white box-border content-stretch flex gap-[10px] items-center opacity-90 p-[10px] relative rounded-[10px] shrink-0" data-name="completed" data-node-id="4:88">
          {tablerCheckIcon}
        </div>
        <div className="bg-white box-border content-stretch flex gap-[10px] items-center px-[20px] py-[15px] relative rounded-[10px] shrink-0" data-name="goals" data-node-id="4:91">
          {lucideGoalIcon}
        </div>
        {profile}
      </div>
    );
  }
  return (
    <div className={className} data-name="Tab=Completed" data-node-id="4:85">
      <div className="bg-white box-border content-stretch flex gap-[10px] items-center px-[20px] py-[15px] relative rounded-[10px] shrink-0" data-name="completed" data-node-id="4:71">
        {tablerCheckIcon}
      </div>
      <div className="bg-white box-border content-stretch flex gap-[10px] items-center opacity-90 p-[10px] relative rounded-[10px] shrink-0" data-name="goals" data-node-id="4:74">
        {lucideGoalIcon}
      </div>
      {profile}
    </div>
  );
}

interface ObjectifProps {
  className?: string;
  temps?: string;
  description?: string;
  titre?: string;
  objectif?: string;
}

function Objectif({ className, temps = "24", description = "Vous avez réussi à Coder en Next depuis 24 jours. Continuez !", titre = "Coder en Next", objectif = "31 jours" }: ObjectifProps) {
  // Choose meter based on progress (you can make this dynamic later)
  const getMeterAsset = (days: string) => {
    const dayNumber = parseInt(days);
    if (dayNumber >= 40) return metersHigh;
    if (dayNumber >= 20) return metersMed;
    return metersLow;
  };

  return (
    <div className={className} data-name="Objectif" data-node-id="4:400">
      <div className="box-border content-stretch flex flex-col gap-[10px] items-start p-[10px] relative shrink-0 w-full" data-name="Meter" data-node-id="4:537">
        <div className="h-[77.398px] relative shrink-0 w-full" data-name="meters" data-node-id="I4:537;4:499">
          <div className="absolute h-[77.398px] left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-[102.5px]" data-name="background" data-node-id="I4:537;4:500">
            <div className="absolute inset-[-5.17%_-3.9%_-2.64%_-3.9%]">
              <Image alt="Progress meter" className="block max-w-none size-full" src={getMeterAsset(temps)} width={120} height={90} />
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col font-adamina-regular items-center justify-center leading-[normal] left-[calc(50%-0.25px)] not-italic text-center text-nowrap top-[calc(50%+6.301px)] translate-x-[-50%] translate-y-[-50%] whitespace-pre" data-name="Texte" data-node-id="I4:537;4:502">
          <p className="relative shrink-0 text-[24px] text-black" data-node-id="I4:537;4:503">
            {temps}
          </p>
          <p className="relative shrink-0 text-[#8a8a8a] text-[12px]" data-node-id="I4:537;4:504">
            jours
          </p>
        </div>
      </div>
      <div className="basis-0 content-stretch flex flex-col grow items-center min-h-px min-w-px relative shrink-0 w-full" data-name="Desc" data-node-id="4:423">
        <p className="font-abhaya-libre-bold leading-[normal] not-italic relative shrink-0 text-[14px] text-black text-center w-full" data-node-id="4:425">
          {titre}
        </p>
        <p className="basis-0 font-arapey-regular grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black text-center w-full" data-node-id="4:426">
          {description}
        </p>
        <div className="content-stretch flex gap-[2px] items-center justify-center leading-[normal] not-italic relative shrink-0 text-[#8a8a8a] text-[12px] text-center text-nowrap w-full whitespace-pre" data-name="goal" data-node-id="4:618">
          <p className="font-abhaya-libre-bold relative shrink-0" data-node-id="4:614">
            Objectif :
          </p>
          <p className="font-abhaya-libre-regular relative shrink-0" data-node-id="4:623">
            {objectif}
          </p>
        </div>
      </div>
      <div className="content-stretch flex gap-[5px] h-[20px] items-start overflow-clip relative shrink-0 w-full" data-name="Buttons" data-node-id="4:427">
        <div className="aspect-[24/24] bg-[#cccccc] box-border content-stretch flex gap-[10px] h-full items-center overflow-clip p-[4px] relative rounded-[100px] shrink-0" data-node-id="4:434">
          <div className="aspect-[24/24] basis-0 grow min-h-px min-w-px overflow-clip relative shrink-0" data-name="tabler:trash" data-node-id="4:438">
            <div className="absolute inset-[12.5%_16.67%]" data-name="Vector" data-node-id="4:439">
              <div className="absolute inset-[-5.56%_-6.25%]">
                <Image alt="Delete icon" className="block max-w-none size-full" src={tablerTrash} width={16} height={16} />
              </div>
            </div>
          </div>
        </div>
        <div className="basis-0 bg-[#8df3d8] box-border content-stretch flex gap-[10px] grow h-full items-center justify-center min-h-px min-w-px overflow-clip px-[10px] py-[4px] relative rounded-[100px] shrink-0" data-name="Modifier" data-node-id="4:428">
          <div className="aspect-[24/24] h-full overflow-clip relative shrink-0" data-name="lucide:edit" data-node-id="4:440">
            <div className="absolute contents inset-[8.35%_8.35%_12.5%_12.5%]" data-name="Group" data-node-id="4:441">
              <div className="absolute inset-[12.5%]" data-name="Vector" data-node-id="4:442">
                <div className="absolute inset-[-5.556%]">
                  <Image alt="Edit icon" className="block max-w-none size-full" src={lucideEdit} width={16} height={16} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="aspect-[24/24] bg-[#fcb8b8] box-border content-stretch flex gap-[10px] h-full items-center overflow-clip p-[4px] relative rounded-[100px] shrink-0" data-node-id="4:430">
          <div className="aspect-[12/12] basis-0 grow min-h-px min-w-px overflow-clip relative shrink-0" data-name="qlementine-icons:reset-16" data-node-id="4:431">
            <div className="absolute inset-[0.06%_6.25%_6.21%_0.04%]" data-name="Vector" data-node-id="4:432">
              <Image alt="Reset icon" className="block max-w-none size-full" src={qlementineReset} width={16} height={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MobileGoals() {
  // Custom status icons component
  const StatusIcons = () => (
    <div className="h-[20px] relative shrink-0 w-[56.08px] flex items-center justify-end gap-1" data-name="Icones" data-node-id="1:10">
      <Image alt="Network" className="h-[12px] w-auto" src={network} width={16} height={12} />
      <Image alt="WiFi" className="h-[12px] w-auto" src={wifi} width={16} height={12} />
      <Image alt="Battery" className="h-[12px] w-auto" src={battery} width={24} height={12} />
    </div>
  );

  return (
    <div className="bg-[#444444] content-stretch flex flex-col items-start relative size-full" data-name="Mobile / Goals" data-node-id="1:2">
      <div className="box-border content-stretch flex items-center justify-between overflow-clip px-[10px] py-[5px] relative shrink-0 w-full" data-name="Barre haut" data-node-id="1:8">
        <p className="font-inter-medium leading-[normal] not-italic relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre" data-node-id="1:9">
          13:28
        </p>
        <StatusIcons />
      </div>
      <div className="box-border content-stretch flex gap-[10px] items-center justify-center overflow-clip p-[10px] relative shrink-0 w-full" data-name="browser header" data-node-id="1:5">
        <div className="relative shrink-0 size-[24px]" data-name="material-symbols:home-outline-rounded" data-node-id="1:30">
          <Image alt="Home icon" className="block max-w-none size-full" src={materialHome} width={24} height={24} />
        </div>
        <div className="basis-0 bg-[#313131] box-border content-stretch flex gap-[10px] grow items-center min-h-px min-w-px overflow-clip px-[20px] py-[10px] relative rounded-[100px] shrink-0" data-name="adress" data-node-id="1:6">
          <p className="font-inter-medium leading-[normal] not-italic relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre" data-node-id="1:21">
            www.adresse-du-site.com
          </p>
        </div>
        <div className="relative shrink-0 size-[24px]" data-name="fluent:tabs-24-regular" data-node-id="1:32">
          <Image alt="Tabs icon" className="block max-w-none size-full" src={fluentTabs} width={24} height={24} />
        </div>
        <div className="overflow-clip relative shrink-0 size-[22px]" data-name="charm:menu-kebab" data-node-id="1:15">
          <div className="absolute inset-[10.94%_45.31%]" data-name="Group" data-node-id="1:16">
            <div className="absolute inset-[-6%_-50%]">
              <Image alt="Menu kebab icon" className="block max-w-none size-full" src={charmMenuKebab} width={24} height={24} />
            </div>
          </div>
        </div>
      </div>
      <div className="basis-0 bg-[#cafdef] box-border content-stretch flex flex-col gap-[10px] grow items-start min-h-px min-w-px overflow-clip p-[10px] relative shrink-0 w-full h-full" data-name="page" data-node-id="1:3">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-start overflow-clip p-[10px] relative shrink-0 w-full" data-name="header" data-node-id="1:34">
          <p className="font-abhaya-libre-bold leading-[normal] not-italic relative shrink-0 text-[24px] text-black text-nowrap whitespace-pre" data-node-id="1:35">
            Mes objectifs
          </p>
        </div>
        <div className="basis-0 content-stretch flex gap-[10px] grow items-start justify-start min-h-px min-w-px relative shrink-0 w-full overflow-y-scroll" data-name="Objectifs container" data-node-id="20:231">
          <div className="basis-0 box-border content-start flex flex-wrap gap-[10px] grow items-start min-h-px min-w-px overflow-clip p-[10px] px-0 relative shrink-0" data-name="Objectifs" data-node-id="1:36">
            <Objectif className="bg-[rgba(255,255,255,0.9)] box-border content-stretch flex flex-col gap-[10px] h-[240px] items-center overflow-clip p-[10px] relative rounded-[10px] shrink-0 w-[162.5px]" />
            <Objectif 
              className="bg-[rgba(255,255,255,0.9)] box-border content-stretch flex flex-col gap-[10px] h-[240px] items-center overflow-clip p-[10px] relative rounded-[10px] shrink-0 w-[162.5px]"
              temps="12"
              titre="Coder en PHP"
              description="Vous avez réussi à Coder en PHP depuis 12 jours. Continuez !"
              objectif="31 jours"
            />
            <Objectif 
              className="bg-[rgba(255,255,255,0.9)] box-border content-stretch flex flex-col gap-[10px] h-[240px] items-center overflow-clip p-[10px] relative rounded-[10px] shrink-0 w-[162.5px]"
              temps="48"
              titre="Avoir son BUT 3"
              description="Vous avez réussi à Avoir son BUT 3 depuis 48 jours. Continuez !"
              objectif="1 an"
            />
          </div>
        </div>
        <Nav tab="Goals" className="box-border content-stretch flex gap-[15px] h-[74px] items-center justify-center overflow-clip p-[10px] relative shrink-0 w-full" />
      </div>
      <div className="box-border content-stretch flex gap-[10px] items-center justify-center overflow-clip px-[60px] py-[10px] relative shrink-0 w-full" data-name="Barre bas" data-node-id="1:22">
        <div className="basis-0 box-border content-stretch flex gap-[10px] grow items-center justify-center min-h-px min-w-px px-0 py-[10px] relative shrink-0" data-name="Bouton" data-node-id="1:23">
          <div className="bg-white rounded-[3px] shrink-0 size-[15px]" data-name="Onglets" data-node-id="1:24" />
        </div>
        <div className="basis-0 box-border content-stretch flex gap-[10px] grow items-center justify-center min-h-px min-w-px px-0 py-[10px] relative shrink-0" data-name="Bouton" data-node-id="1:25">
          <div className="bg-white rounded-[60px] shrink-0 size-[15px]" data-name="Menu" data-node-id="1:26" />
        </div>
        <div className="basis-0 box-border content-stretch flex gap-[10px] grow items-center justify-center min-h-px min-w-px px-0 py-[10px] relative shrink-0" data-name="Bouton" data-node-id="1:27">
          <div className="h-[15px] relative shrink-0 w-[11.897px] bg-white rounded-sm" data-name="Retour" data-node-id="1:28">
            {/* Back arrow placeholder - you can add the SVG later */}
          </div>
        </div>
      </div>
    </div>
  );
}
