//initialize the global variables
var isIE = ((navigator.appName.indexOf('Microsoft')>=0)?true:false);
var g_isadmin = 0;

var tmp_mon;
var tmp_date;
var tmp_year;
var tmp_hr;
var tmp_min;
var tmp_sec;
var tmp_ntp;
var tmp_ntpopt;
var tmp_utcoffset;

var ntpstatus;
var issaventp = false;

function doInit()
{
	exposeElms([
				'_ntpError',
				'_optNTP',
				'_ntpServer',
				'_utcOffset',
				'_fMonth',
				'_fDate',
				'_fYear',
				'_fHour',
				'_fMin',
				'_fSec',
				'_refreshBtn',
				'_saveBtn']);
	CheckRole();
	
	var month = [	'January', 'February', 'March', 'April', 
					'May', 'June', 'July', 'August', 
					'September', 'October', 'November', 'December'];
	
	optind =0;
	for(dat=1; dat<=31; dat++)
		fDate.add(new Option(dat,dat),isIE?optind++:null);
	
	optind = 0;
	for(mon=0; mon<12; mon++)
		fMonth.add(new Option(month[mon], mon), isIE?optind++:null);
	
	optind = 0;
	for(year = 2005; year<=2050; year++)
		fYear.add(new Option(year, year), isIE?optind++:null);
		
	optind = 0;
	for(offset = -11; offset<=12; offset++)
		utcOffset.add(new Option(offset,offset), isIE?optind++:null);

	optNTP.onclick = doNTP;
	saveBtn.onclick = doSave;
	refreshBtn.onclick = doRefresh;
}

function CheckRole()
{
	//alert("CheckRole()");
	xmit.get({url:'/rpc/getrole.asp', onrcv:OnCheckRole, status:''});
}

function OnCheckRole()
{
	//alert("OnCheckRole()");
	if(WEBVAR_JSONVAR_GET_ROLE.WEBVAR_STRUCTNAME_GET_ROLE[0]['CURPRIV'] != 4)
	{
		g_isadmin = 0;
		disableAll();
	}
	else
	{
		g_isadmin = 1;
	}
	issaventp = false;
	getDATStatus();
}

function enableNTP()
{
	//alert("enableNTP()");
	if (g_isadmin)
	{
		fMonth.disabled = true;
		fDate.disabled = true;
		fYear.disabled = true;
		fHour.disabled = true;
		fMin.disabled = true;
		fSec.disabled = true;
		
		optNTP.checked = true;
		ntpServer.disabled = false;
		utcOffset.disabled = false;
	}
	else
		disableAll();
}

function disableNTP()
{
	//alert("disableNTP()");
	if (g_isadmin)
	{
		fMonth.disabled = false;
		fDate.disabled = false;
		fYear.disabled = false;
		fHour.disabled = false;
		fMin.disabled = false;
		fSec.disabled = false;

		optNTP.checked = false;
		ntpServer.disabled = true;
		utcOffset.disabled = true;
	}
	else
		disableAll();
}

function disableAll()
{
	//alert("disableAll()");
	saveBtn.disabled = true;
	fMonth.disabled = true;
	fDate.disabled = true;
	fYear.disabled = true;
	fHour.disabled = true;
	fMin.disabled = true;
	fSec.disabled = true;

	optNTP.disabled = true;
	ntpServer.disabled = true;
	utcOffset.disabled = true;
}

function doNTP()
{
	//alert("doNTP()");
	if(optNTP.checked)
	{
		enableNTP();
	}
	else
	{
		disableNTP();
	}
}

// [Linda]
function getDATStatus()
{
	//alert("getDATStatus()");
	showWait(true);
	xmit.get({url:"/rpc/getdatstatus.asp", onrcv:respDATStatus, status:''});
}

// [Linda]
function respDATStatus()
{
    //alert("respDATStatus()");
    showWait(false);
    var CmdStatus = WEBVAR_JSONVAR_GETDATSTATUS.HAPI_STATUS;
    var datStatus;
    
    if( CmdStatus != 0)
    {
		errstr = "Error in getDATStatus function";
		alert (errstr);
		return;
    }
    datStatus = WEBVAR_JSONVAR_GETDATSTATUS.WEBVAR_STRUCTNAME_GETDATSTATUS[0]['DATSTATUS'];
    
    //alert("[respDATStatus] datStatus: " + datStatus);
    if(datStatus == 0) //Manual
    {
		disableNTP();	
    }
    else if (datStatus == 1) //NTP server
    {
		enableNTP();
	
    }
    /*
    else
		alert('Error: datStatus is not 0 or 1');
    */

  
    doGetDateTime();
    getNTPCfg();

}


function getNTPCfg()
{
	//alert("getNTPCfg()");
	showWait(true);
	xmit.get({url:"/rpc/getntpcfg.asp", onrcv:respNTPCfg, status:''});
}

function respNTPCfg()
{
	//alert("respNTPCfg()");
	var cmdstatus = WEBVAR_JSONVAR_GETNTPCFG.HAPI_STATUS;
	var ntpcfg = WEBVAR_JSONVAR_GETNTPCFG.WEBVAR_STRUCTNAME_GETNTPCFG[0];
	if (cmdstatus != 0)
	{
		errstr = eLang.getString('common','STR_CONFIG_NTPCFG_GETVAL');
		errstr += (eLang.getString('common','STR_IPMI_ERROR')+GET_ERROR_CODE(cmdstatus));
		alert (errstr);
		disableNTP();
	}
	else
	{
		ntpstatus = ntpcfg.NTP_STATUS;
		
		
            if(optNTP.checked == true)
	    {
		if (ntpstatus.indexOf("Success") != -1)
		{
			//enableNTP();
			ntpError.innerHTML = '';
			if(issaventp)
				alert(eLang.getString('common','STR_APP_NTP_SAVE'));
		}
		else if (ntpstatus.indexOf("Failure") != -1)
		{
			//enableNTP();
			ntpError.innerHTML = eLang.getString('common','STR_APP_NTPSERVER_FAILED');
			alert(eLang.getString('common','STR_APP_NTPSERVER_FAILED')); 
		}
		/*
		else if (ntpstatus.indexOf("Manual") != -1)
		{
			disableNTP();
			ntpError.innerHTML = '';
		}
		*/

	    }
	    /* else alert("[respNTPCfg] /var/ntp.stat: no need to check ntp.stat */


		//alert("[respNTPCfg] ntpcfg.SERVER_NAME: "+ ntpcfg.SERVER_NAME + ", ntpcfg.UTC_OFFSET: "+ ntpcfg.UTC_OFFSET);
		ntpServer.value = ntpcfg.SERVER_NAME;
		utcOffset.value = ntpcfg.UTC_OFFSET;

		//Preserving values
		//alert("[respNTPCfg] preserve ntpopt, server, offset");
		tmp_ntpopt = optNTP.checked;
		tmp_ntp = ntpServer.value;
		tmp_utcoffset = utcOffset.value;
	}
	showWait(false);
}

function doGetDateTime()
{
	//alert("doGetDateTime()");
	showWait(true);
	var gDt = xmit.getset({url:"/rpc/getdatetime.asp",onrcv:respGetDateTime, status:''});
	gDt.send();
	delete gDt;
}

function respGetDateTime()
{
	//alert("respGetDateTime()");
	var CmdStatus = WEBVAR_JSONVAR_GETDATETIME.HAPI_STATUS;
	if (CmdStatus != 0)
	{
		errstr = eLang.getString('common','STR_CONFIG_DATE_TIME_GETVAL');
		errstr += (eLang.getString('common','STR_IPMI_ERROR')+GET_ERROR_CODE(CmdStatus));
		alert(errstr);
	}
	else
	{
		var tmp_seconds = WEBVAR_JSONVAR_GETDATETIME.WEBVAR_STRUCTNAME_GETDATETIME[0].SECONDS;
		//tmp_seconds = (tmp_seconds + (utcOffset.value) * 1000;
		//alert("[respGetDateTime] get sec= "+tmp_seconds);
		tmp_seconds = (tmp_seconds) * 1000; //linda
		
		var EvtDate = new Date(tmp_seconds);

		fMonth.value = EvtDate.getUTCMonth();
		fDate.value = EvtDate.getUTCDate();
		fYear.value = EvtDate.getUTCFullYear();

		var disp_hours = EvtDate.getUTCHours();
		fHour.value = ((disp_hours < 10)?"0":"") + disp_hours;
		var disp_mins = EvtDate.getUTCMinutes();
		fMin.value = ((disp_mins < 10)?"0":"") + disp_mins;
		var disp_secs = EvtDate.getUTCSeconds();
		fSec.value = ((disp_secs < 10)?"0":"") + disp_secs;

		//Preserving the values
		//alert("[respGetDateTime] preserve old time");		
		tmp_mon = fMonth.value;
		tmp_date = fDate.value;
		tmp_year = fYear.value;
		tmp_hr = fHour.value;
		tmp_min = fMin.value;
		tmp_sec = fSec.value;
	}
	showWait(false);
}

function doSave()
{
	//alert("doSave()");
	if (g_isadmin)
	{
		if (!optNTP.checked)
		{
			if(!eVal.isnum(parseInt(fHour.value))||(23 < parseInt(fHour.value))||(0 > parseInt(fHour.value)))
			{
				alert(eLang.getString('common','STR_APP_STR_HOUR'));
				return;
			}
			if(!eVal.isnum(parseInt(fMin.value))||(59 < parseInt(fMin.value))||(0 > parseInt(fMin.value)))
			{
				alert(eLang.getString('common','STR_APP_STR_MIN'));
				return;
			}
			if(!eVal.isnum(parseInt(fSec.value))||(59 < parseInt(fSec.value))||(0 > parseInt(fSec.value)))
			{
				alert(eLang.getString('common','STR_APP_STR_SEC'));
				return;
			}
			
			if((fMonth.value)== 1)
			{
				if((fYear.value)%4 ==0)
				{
					if((fDate.value)> 29)
					{
						alert(eLang.getString('common','STR_APP_STR_FEB_LEAP'));
						return;
					}
				}
				else
				{
					if((fDate.value)> 28)
					{
						alert(eLang.getString('common','STR_APP_STR_FEB'));
						return;
					}
				}		
			}
			else if(((fMonth.value)== 3)  || ((fMonth.value)== 5) ||((fMonth.value)== 8) ||((fMonth.value)== 10))
			{
				if((fDate.value)> 30)
				{
					alert(eLang.getString('common','STR_APP_STR_MONTH_30'));
					return;
				}
			}
		
			showWait(true);
			var dt = xmit.getset({url:"/rpc/setdatetime.asp",onrcv:respSetDateTime, status:''});
			var tmpseconds = Date.UTC(fYear.value,fMonth.value,fDate.value,parseInt(fHour.value, 10),parseInt(fMin.value, 10),parseInt(fSec.value, 10));

			//alert("[doSave] manually set** tmpseconds: " + tmpseconds + ", utcOffset.value(no use): " + utcOffset.value + ", STATUE: Manual(no use)");
			dt.add("SECONDS",tmpseconds/1000);		//To milliseconds to seconds
			dt.add("UTC_OFFSET",utcOffset.value); //no use
			dt.add("STATUS","Manual"); // no use
			dt.send();
			delete dt;
		}
		else
		{
			if (!eVal.domainname_ntp(ntpServer.value))
			{
				alert(eLang.getString('common','STR_APP_INVALID_NTPSERVER'));
				return;
			}
			//alert("[doSave] ntp set** ntpServer.value(new): " + ntpServer.value + ", tmp_ntp(old): " + tmp_ntp + ", utcOffset.value: " + utcOffset.value);
			showWait(true);
			var rpc_ntp = xmit.getset({url:"/rpc/setntpcfg.asp",onrcv:respSetNTPcfg,status:''});
			rpc_ntp.add("NEW_NTPSERVER_NAME",ntpServer.value);
			rpc_ntp.add("OLD_NTPSERVER_NAME",tmp_ntp);
			rpc_ntp.add("UTC_OFFSET",utcOffset.value);
			rpc_ntp.send();
			delete rpc_ntp;
		}
	}
	else
		alert(eLang.getString('common','STR_APP_STR_ERR_ADMIN'));
}

function respSetDateTime()
{
	//alert("respSetDateTime()");
	var CmdStatus = WEBVAR_JSONVAR_SETDATETIME.HAPI_STATUS;
	if (CmdStatus != 0)
	{
		errstr = eLang.getString('common','STR_CONFIG_DATE_TIME_SETVAL');
		errstr +=(eLang.getString('common','STR_IPMI_ERROR')+GET_ERROR_CODE(CmdStatus));
		alert(rErrStr);
	}
	else
	{
		alert (eLang.getString('common','STR_APP_DAT_SAVE'));
		issaventp = false;
		getNTPCfg();
		doGetDateTime();
	}
	showWait(false);
}

function respSetNTPcfg()
{
	//alert("respSetNTPcfg()");
	var cmdstatus = WEBVAR_JSONVAR_SETNTPCFG.HAPI_STATUS;
	if(cmdstatus != 0)
	{
		errstr = eLang.getString('common','STR_CONFIG_NTPCFG_SETVAL');
		errstr += (eLang.getString('common','STR_IPMI_ERROR')+GET_ERROR_CODE(cmdstatus));
		alert (errstr);
	}
	else
	{
		issaventp = true;
		getNTPCfg();
		doGetDateTime();
	}
	showWait(false);
}

function getPreserveValues()
{
	//alert("getPreserveValues()");
	fMonth.value = tmp_mon;
	fDate.value = tmp_date;
	fYear.value = tmp_year;
	fHour.value =tmp_hr;
	fMin.value = tmp_min;
	fSec.value = tmp_sec;

	ntpServer.value = tmp_ntp;
	optNTP.checked = tmp_ntpopt;
	utcOffset.value = tmp_utcoffset;
}

function doRefresh()
{

doGetDateTime();
/*
	alert("doRefresh()");
	if (tmp_ntpopt == optNTP.checked)
	{
		if (optNTP.checked)	//Check whether any changes made to NTP configuration
		{
			if ((tmp_ntp == ntpServer.value) && (tmp_utcoffset == utcOffset.value))
			{
				doGetDateTime();
			}
			else		
			{
				if(confirm(eLang.getString('common','STR_APP_NTPCONF_SAVE')))
				{
					doSave();
				}
				else
				{
					getPreserveValues();
					doNTP();
					doGetDateTime();
				}
			}
		}
		else		//Check whether any changes made to Date and Time configuration
		{
			if((tmp_mon == fMonth.value) && (tmp_date == fDate.value) && (tmp_year == fYear.value)
			&& (tmp_hr == fHour.value) && (tmp_min == fMin.value) && (tmp_sec == fSec.value)
			&& (tmp_utcoffset == utcOffset.value))
			{
				doGetDateTime();
			}
			else
			{
				if(confirm(eLang.getString('common','STR_APP_NTPCONF_SAVE')))
				{
					doSave();
				}
				else
				{
					getPreserveValues();
					doNTP();
					doGetDateTime();
				}
			}
		}
	}
	else
	{
		if(confirm(eLang.getString('common','STR_APP_NTPCONF_SAVE')))
		{
			doSave();
		}
		else
		{
			getPreserveValues();
			doNTP();
			doGetDateTime();
		}
	}
*/
}
