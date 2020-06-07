// Library Module : eVal.js
// Separated By : chandrasekarr@amiindia.co.in
// Reason : For the purpose of validation in MDS 

var 	EXTENDED_ERROR = 10;

var eVal = {
	verbose : true,
	lastErrorNum : 0,

    islower : function(c)
    {
            if( (c >= "a") && (c <= "z") )
                return true;
            else
                return false;
    },
    isupper : function(c)
    {
            if( (c >= "A") && (c <= "Z") )
                return true;
            else
                return false;
    },
    isalpha : function(c)
    {
            if( this.islower(c) || this.isupper(c) )
                return true;
            else
                return false;
    },
    isdigit : function(c)
    {
            if ( (c >= "0") && (c <= "9") )
                return true;
            else
                return false;
    },
	isnum : function(n)
	{
		return typeof n == 'number' && isFinite(n);
	},
	isnumstr : function(str, radix)
	{
		var v = parseInt(str, radix);
		if((v+'') != str){return false;}
		//alert('here');
		return typeof v == 'number' && isFinite(v);
	},
	endsWith : function(str, lookfor)
	{
		var strlen = str.length;
		var lookforlen = lookfor.length;
		var lookforptr = lookforlen;

		while( lookforptr > 0 )
		{
			if( str.charAt(strlen-lookforptr) != lookfor.charAt(lookforlen-lookforptr) )
				return false;
			lookforptr--;
		}
		return true;
	},
	email : function(e)
	{
		var filter =  /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9])+$/;
		var v = new String(e);

		if ( v.match( (filter) ) )
		{
			return true;
		}
		delete v;
		if(this.verbose){eLang.getString('err',EXTENDED_ERROR+31);}
		this.lastErrorNum = EXTENDED_ERROR+31;
		return false;
	},
	str : function(n)
	{
		var filter =  /^([a-zA-Z0-9_\-])+$/;
		var v = new String(n);
		if ( v.match( (filter) ) )
		{
			return true;
		}
		delete v;
		return false;
	},
	ip : function(ip,boolAllow0000)
	{
		var ipv = (new String(ip)).split(".");
		if(ipv.length != 4)
			{
			if(this.verbose)
				{
				eLang.getString('err',EXTENDED_ERROR+30);
				}
			this.lastErrorNum = EXTENDED_ERROR+30;
			return false;
			}
		for( var i=0; i<4 ;i++)
			{
			if( isNaN(ipv[i]) || ipv[i]=="" || ipv[i] < 0 || ipv[i] > 255 ||ipv[i].length>3 || ipv[0]==0)
				{
				if(this.verbose)
					{
					eLang.getString('err',EXTENDED_ERROR+30);
					}
				this.lastErrorNum = EXTENDED_ERROR+30;
				return false;
				}
			}

// Disabled now that IP validation is done in HAPI
// [BrandonB] 1/12/04
//       // Now just compare directly to some invalid IPs
//       var invalidIPs=[
//                      [127,0,0,1],
//                      [0,24,56,4],
//                      [255,255,255,0],
//                      [91,91,91,91],
//                      [0,0,0,0]            // <--- 0.0.0.0 ALWAYS the last entry!
//                      ]
//
//       var arLen=invalidIPs.length;
//       if (boolAllow0000)
//          {
//          arLen--;
//          }
//
//       for (i=0;i<arLen;i++)
//          {
//          if ((ipv[0]==invalidIPs[i][0])&&
//              (ipv[1]==invalidIPs[i][1])&&
//              (ipv[2]==invalidIPs[i][2])&&
//              (ipv[3]==invalidIPs[i][3])||
//              (ipv[3]==255)
//              )
//             {
//             if(this.verbose)
//                {
//                eLang.getString('err',EXTENDED_ERROR+30);
//                }
//             this.lastErrorNum = EXTENDED_ERROR+30;
//             return false;
//             }
//          }
		delete ipv;
		return true;
	},
    netMask : function(subnetMask)
	{
		var re = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
		var flag = 0;
		if (re.test(subnetMask)) //should have 3 parts.
		{
			var parts = subnetMask.split(".");
			var maskGood  = new Array (0,0,0,0);

			for (var i=0; i<parts.length; i++){
				maskGood[i] = correctField(parseInt(parseFloat(parts[i] )));
				if ( maskGood[i]  < 255 )
					break;
			}
			for (i++ ; i < parts.length;i++){
				if ( parseInt(parseFloat(parts[i] )) != 0 ){
					flag = 1;
					break;
				}
			}
			if ( flag == 1 ){
				if(this.verbose){eLang.getString('err',EXTENDED_ERROR+28);}
				this.lastErrorNum = EXTENDED_ERROR+28;
				return false;
			}
			return true;

		} else {
			if(this.verbose){eLang.getString('err',EXTENDED_ERROR+28);}
			this.lastErrorNum = EXTENDED_ERROR+28;
			return false;
		}
	},

	port : function(p)
	{
		if((p>0)&&(p<=65535))
		{
			return true;
		}
		if(this.verbose){eLang.getString('err',EXTENDED_ERROR+29);}
		this.lastErrorNum = EXTENDED_ERROR+29;
		return false;
	},
    username : function (username)
    {
        if( (username.length > 32) || (username.length < 4) )
        {
            if(this.verbose){eLang.getString('err',EXTENDED_ERROR+27);}
			this.lastErrorNum = EXTENDED_ERROR+27;
            return false;
        }
        if( !this.isalpha(username.charAt(0)) )
        {
            if(this.verbose){eLang.getString('err',EXTENDED_ERROR+26);}
			this.lastErrorNum = EXTENDED_ERROR+26;
            return false;
        }
        var usernamecopy = new String(username);
        var invalidchar_filter = /([,; ])/;
        if( usernamecopy.match(invalidchar_filter) )
        {
            if(this.verbose){eLang.getString('err',EXTENDED_ERROR+25);}
			this.lastErrorNum = EXTENDED_ERROR+25;
            return false;
        }
        else
        {
            return true;
        }
    },
    password : function (password, minlen, maxlen)
    {
		if(minlen){minlen=minlen;}else{var minlen=8;}
		if(maxlen){maxlen=maxlen;}else{var maxlen=32;}
        if( (password.length > maxlen) || (password.length < minlen) )
        {
            if(this.verbose){eLang.getString('err',EXTENDED_ERROR+24);}
			this.lastErrorNum = EXTENDED_ERROR+24;
            return false;
        }
		  else
			  {
			  // Create regexp to validate ip
			  var re=/^[^ ]+$/;
			  if (re.test(password)==false)
				  {
				  //alert(eLang.getSysString("STR_PASSWORD_SPC"));
				  return false;
				  }
			  }
		  return true;
    },

	domainname_ntp : function (n)
    	{
		var filter =  /[a-zA-Z0-9]{1}[a-zA-Z0-9 \-\_]*/;
		var v = new String(n);
		v = v.split('.');
		if(v[v.length-1] != "")
		{
			for(i=0;i<v.length;i++)
			{
				tmp = v[i].replace(filter,"");
				if((v[i] == "") ||(tmp.length>0))
				{
					delete v;
					return false;
				}
			}
		}
		else
		{
			delete v;
			return false;
		}
		delete v;
		return true;
    	},

	domainname : function (n,atleastonedot)
    	{
		var filter =  /[a-zA-Z0-9]{1}[a-zA-Z0-9 \-\_]*/;
		var v = new String(n);
		if((v.length <= 0) || (v.length > 255))
		{
			delete v;
			return false;
		}
		
		v = v.split('.');
		if ((atleastonedot) && (1 == v.length))			//if there is no dot, it returns false. (atleast one dot must)
		{
			delete v;
			return false;
		}
		if ((!atleastonedot) && (1 < v.length))			//if there is dot, it returns false. (dot not allowed)
		{
			delete v;
			return false;
		}
		
		if(v[v.length-1] != "")
		{
			for(i=0;i<v.length;i++)
			{
				tmp = v[i].replace(filter,"");
				if((v[i] == "") ||(tmp.length>0))
				{
					delete v;
					return false;
				}
			}
		}
		else
		{
			delete v;
			return false;
		}
		delete v;
		return true;
    	},

	// Added validation routine [BrandonB] 3/9/04
	// Input:
	//  value = hex string, can have leading 0x or just the number
	//  rangelow = lowest possible value
	//  rangehigh = highest possible value
	//  numdigits = max number of digits
	//  func = null=just check value, 1=return just hex digits as a string
	// Output:
	//  0 - ok
	//  1 - error with range
	//  2 - error with number of digits

	hexnumber:function (value, rangelow, rangehigh, numdigits, func)
	{
		var HEX_OK=0;
		var HEX_RANGE_ERR=1;
		var HEX_NUMDIGITS_ERR=2;
		var HEX_NUMERIC_ERR=3;

		var retVal=HEX_OK;
		var re=/^[a-fA-F0-9]*$/;
		// Strip off leading 0's, x or X and get just the digits
		var digitsstr=value.substr(value.search(/[a-fA-F1-9]/));	// the string value of just the hex digits

		// Step 1 check number of digits
		if (digitsstr.length>numdigits)
			{
			retVal=HEX_NUMDIGITS_ERR;
			}
		else
			{
			// Step 2 check hex value
			if (re.exec(digitsstr)!=null)
				{
				// Step 3 check ranges
				var digitsvalue=parseInt(digitsstr,16);	// the actual numeric value of the hex digits
				if ( (digitsvalue>=rangelow)&&(digitsvalue<=rangehigh))
					{
					retVal=HEX_OK;
					}
				else
					{
					retVal=HEX_RANGE_ERR;
					}
				}
			else
				{
				retVal=HEX_NUMERIC_ERR;
				}
			}
		if (func==1)
			{
			return (digitsstr);
			}
		else
			{
			return retVal;
			}
	},


	elm : function(name, type)
	{
		if(type == 'ip')
		{
			return this.ip(document.getElementById(name).value);
		}
		else if(type == 'str')
		{
			return this.str(document.getElementById(name).value);
		}
		else if(type == 'email')
		{
			return this.email(document.getElementById(name).value);
		}
		else if(type == 'username')
		{
			return this.username(document.getElementById(name).value);
		}
		else if(type == 'password')
		{
			return this.password(document.getElementById(name).value);
		}
		else if(type == 'port')
		{
			return this.port(document.getElementById(name).value);
		}
		else if(type == 'netMask')
		{
			return this.netMask(document.getElekemntById(name).value);
		}

		return false;
	},
	alertRangeInput : function(obj,lval,hval)
	{
		if((obj.value >= lval)&&(obj.value <= hval)){return true;}
		alert(eLang.getErrString(EXTENDED_ERROR+23)+lval+' - '+hval);
		obj.value = ''+lval+'';
	},
	hapiStatus : function(jvar, extramsg) //argument: JSON VAR NAME
	{
		if(jvar.HAPI_STATUS)
		{
			if(this.verbose){eLang.getString('err',jvar.HAPI_STATUS, extramsg);}
			return false;
		}
		return true;
	},
	getLastErrorStr : function()
	{
		return eLang.getString('err',this.lastErrorNum);
	}
}